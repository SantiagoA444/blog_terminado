from datetime import datetime, timezone
from hashlib import md5
from time import time
from typing import Optional
import sqlalchemy as sa
import sqlalchemy.orm as so
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from app import app, db, login


followers = sa.Table(
    'followers',
    db.metadata,
    sa.Column('follower_id', sa.Integer, sa.ForeignKey('user.id'),
              primary_key=True),
    sa.Column('followed_id', sa.Integer, sa.ForeignKey('user.id'),
              primary_key=True)
)


likes = sa.Table(
    'likes',
    db.metadata,
    sa.Column('user_id', sa.Integer, sa.ForeignKey('user.id'),
              primary_key=True),
    sa.Column('post_id', sa.Integer, sa.ForeignKey('post.id'),
              primary_key=True),
    sa.Column('is_like', sa.Boolean, nullable=False, default=True)
)


class User(UserMixin, db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    username: so.Mapped[str] = so.mapped_column(sa.String(64), index=True,
                                                unique=True)
    email: so.Mapped[str] = so.mapped_column(sa.String(120), index=True,
                                             unique=True)
    password_hash: so.Mapped[Optional[str]] = so.mapped_column(sa.String(256))
    about_me: so.Mapped[Optional[str]] = so.mapped_column(sa.String(140))
    last_seen: so.Mapped[Optional[datetime]] = so.mapped_column(
        default=lambda: datetime.now(timezone.utc))

    posts: so.WriteOnlyMapped['Post'] = so.relationship(
        back_populates='author')
    following: so.WriteOnlyMapped['User'] = so.relationship(
        secondary=followers, primaryjoin=(followers.c.follower_id == id),
        secondaryjoin=(followers.c.followed_id == id),
        back_populates='followers')
    followers: so.WriteOnlyMapped['User'] = so.relationship(
        secondary=followers, primaryjoin=(followers.c.followed_id == id),
        secondaryjoin=(followers.c.follower_id == id),
        back_populates='following')
    liked_posts: so.WriteOnlyMapped['Post'] = so.relationship(
        secondary=likes, back_populates='likers')

    def __repr__(self):
        return '<User {}>'.format(self.username)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def avatar(self, size):
        digest = md5(self.email.lower().encode('utf-8')).hexdigest()
        return f'https://www.gravatar.com/avatar/{digest}?d=identicon&s={size}'

    def follow(self, user):
        if not self.is_following(user):
            self.following.add(user)

    def unfollow(self, user):
        if self.is_following(user):
            self.following.remove(user)

    def is_following(self, user):
        query = self.following.select().where(User.id == user.id)
        return db.session.scalar(query) is not None

    def followers_count(self):
        query = sa.select(sa.func.count()).select_from(
            self.followers.select().subquery())
        return db.session.scalar(query)

    def following_count(self):
        query = sa.select(sa.func.count()).select_from(
            self.following.select().subquery())
        return db.session.scalar(query)

    def following_posts(self):
        Author = so.aliased(User)
        Follower = so.aliased(User)
        return (
            sa.select(Post)
            .join(Post.author.of_type(Author))
            .join(Author.followers.of_type(Follower), isouter=True)
            .where(sa.or_(
                Follower.id == self.id,
                Author.id == self.id,
            ))
            .group_by(Post)
            .order_by(Post.timestamp.desc())
        )

    def get_reset_password_token(self, expires_in=600):
        return jwt.encode(
            {'reset_password': self.id, 'exp': time() + expires_in},
            app.config['SECRET_KEY'], algorithm='HS256')

    @staticmethod
    def verify_reset_password_token(token):
        try:
            id = jwt.decode(token, app.config['SECRET_KEY'],
                            algorithms=['HS256'])['reset_password']
        except Exception:
            return
        return db.session.get(User, id)

    def like_post(self, post):
        if not self.has_liked_post(post):
            like_entry = sa.select(likes).where(
                (likes.c.user_id == self.id) & (likes.c.post_id == post.id))
            existing = db.session.scalar(like_entry)
            if existing:
                db.session.execute(
                    sa.update(likes).where(
                        (likes.c.user_id == self.id) & (likes.c.post_id == post.id)
                    ).values(is_like=True)
                )
            else:
                db.session.execute(
                    likes.insert().values(user_id=self.id, post_id=post.id, is_like=True)
                )

    def dislike_post(self, post):
        if not self.has_disliked_post(post):
            like_entry = sa.select(likes).where(
                (likes.c.user_id == self.id) & (likes.c.post_id == post.id))
            existing = db.session.scalar(like_entry)
            if existing:
                db.session.execute(
                    sa.update(likes).where(
                        (likes.c.user_id == self.id) & (likes.c.post_id == post.id)
                    ).values(is_like=False)
                )
            else:
                db.session.execute(
                    likes.insert().values(user_id=self.id, post_id=post.id, is_like=False)
                )

    def unlike_post(self, post):
        db.session.execute(
            sa.delete(likes).where(
                (likes.c.user_id == self.id) & (likes.c.post_id == post.id)
            )
        )

    def has_liked_post(self, post):
        like_entry = sa.select(likes).where(
            (likes.c.user_id == self.id) &
            (likes.c.post_id == post.id) &
            (likes.c.is_like == True))
        return db.session.scalar(like_entry) is not None

    def has_disliked_post(self, post):
        like_entry = sa.select(likes).where(
            (likes.c.user_id == self.id) &
            (likes.c.post_id == post.id) &
            (likes.c.is_like == False))
        return db.session.scalar(like_entry) is not None


@login.user_loader
def load_user(id):
    return db.session.get(User, int(id))


class Post(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    body: so.Mapped[str] = so.mapped_column(sa.String(140))
    timestamp: so.Mapped[datetime] = so.mapped_column(
        index=True, default=lambda: datetime.now(timezone.utc))
    user_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey(User.id),
                                               index=True)

    author: so.Mapped[User] = so.relationship(back_populates='posts')
    likers: so.WriteOnlyMapped[User] = so.relationship(
        secondary=likes, back_populates='liked_posts')

    def __repr__(self):
        return '<Post {}>'.format(self.body)

    def like_count(self):
        query = sa.select(sa.func.count()).select_from(
            sa.select(likes.c.user_id).where(
                (likes.c.post_id == self.id) & (likes.c.is_like == True)).subquery())
        return db.session.scalar(query)

    def dislike_count(self):
        query = sa.select(sa.func.count()).select_from(
            sa.select(likes.c.user_id).where(
                (likes.c.post_id == self.id) & (likes.c.is_like == False)).subquery())
        return db.session.scalar(query)
