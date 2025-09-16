// Modern Theme Toggle and Animations
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.createThemeToggle();
        this.initAnimations();
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
        this.updateThemeIcon();
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);

        // Add a subtle animation when switching themes
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    createThemeToggle() {
        const toggle = document.createElement('button');
        toggle.className = 'theme-toggle';
        toggle.innerHTML = '<i class="fas fa-sun"></i>';
        toggle.setAttribute('aria-label', 'Toggle theme');
        toggle.setAttribute('title', 'Toggle dark/light theme');

        toggle.addEventListener('click', () => {
            this.toggleTheme();

            // Add click animation
            toggle.style.transform = 'translateY(-50%) scale(0.9)';
            setTimeout(() => {
                toggle.style.transform = 'translateY(-50%) scale(1)';
            }, 150);
        });

        document.body.appendChild(toggle);
        this.themeToggle = toggle;
    }

    updateThemeIcon() {
        if (this.themeToggle) {
            const icon = this.themeToggle.querySelector('i');
            if (this.currentTheme === 'dark') {
                icon.className = 'fas fa-moon';
            } else {
                icon.className = 'fas fa-sun';
            }
        }
    }

    initAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);

        // Observe post cards
        document.querySelectorAll('.post-card').forEach(card => {
            observer.observe(card);
        });

        // Add stagger animation delay to posts
        document.querySelectorAll('.post-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }
}

// Enhanced Like/Dislike functionality
class InteractionManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindLikeButtons();
        this.bindDislikeButtons();
    }

    bindLikeButtons() {
        document.querySelectorAll('.like-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleLike(e.target.closest('.like-btn'));
            });
        });
    }

    bindDislikeButtons() {
        document.querySelectorAll('.dislike-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleDislike(e.target.closest('.dislike-btn'));
            });
        });
    }

    async handleLike(button) {
        const postId = button.getAttribute('data-post-id');
        const dislikeBtn = button.parentElement.querySelector('.dislike-btn');

        // Add loading state
        button.style.pointerEvents = 'none';
        const originalContent = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        try {
            const response = await fetch(`/like_post/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (data.error) {
                this.showNotification(data.error, 'error');
                return;
            }

            // Update UI with animation
            this.updateLikeButton(button, data.liked, data.like_count);
            this.updateDislikeButton(dislikeBtn, false, data.dislike_count);

            // Show success animation
            this.animateInteraction(button, data.liked ? 'like' : 'unlike');

        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Error al procesar la acción', 'error');
        } finally {
            // Restore button
            button.innerHTML = originalContent;
            button.style.pointerEvents = 'auto';
        }
    }

    async handleDislike(button) {
        const postId = button.getAttribute('data-post-id');
        const likeBtn = button.parentElement.querySelector('.like-btn');

        // Add loading state
        button.style.pointerEvents = 'none';
        const originalContent = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        try {
            const response = await fetch(`/dislike_post/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (data.error) {
                this.showNotification(data.error, 'error');
                return;
            }

            // Update UI with animation
            this.updateDislikeButton(button, data.disliked, data.dislike_count);
            this.updateLikeButton(likeBtn, false, data.like_count);

            // Show success animation
            this.animateInteraction(button, data.disliked ? 'dislike' : 'undislike');

        } catch (error) {
            console.error('Error:', error);
            this.showNotification('Error al procesar la acción', 'error');
        } finally {
            // Restore button
            button.innerHTML = originalContent;
            button.style.pointerEvents = 'auto';
        }
    }

    updateLikeButton(button, isActive, count) {
        const countElement = button.querySelector('.like-count');

        if (isActive) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }

        if (countElement) {
            countElement.textContent = count;
            countElement.classList.add('count-updated');
            setTimeout(() => {
                countElement.classList.remove('count-updated');
            }, 500);
        }
    }

    updateDislikeButton(button, isActive, count) {
        const countElement = button.querySelector('.dislike-count');

        if (isActive) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }

        if (countElement) {
            countElement.textContent = count;
            countElement.classList.add('count-updated');
            setTimeout(() => {
                countElement.classList.remove('count-updated');
            }, 500);
        }
    }

    animateInteraction(button, type) {
        // Create floating animation
        const icon = document.createElement('i');
        icon.className = type === 'like' || type === 'unlike' ? 'fas fa-heart' : 'fas fa-thumbs-down';
        icon.style.cssText = `
            position: absolute;
            color: ${type === 'like' ? '#198754' : type === 'dislike' ? '#dc3545' : '#6c757d'};
            font-size: 1.5rem;
            pointer-events: none;
            z-index: 1000;
            animation: floatUp 1s ease-out forwards;
        `;

        const rect = button.getBoundingClientRect();
        icon.style.left = (rect.left + rect.width / 2) + 'px';
        icon.style.top = rect.top + 'px';

        document.body.appendChild(icon);

        // Create CSS animation if it doesn't exist
        if (!document.querySelector('#floatAnimation')) {
            const style = document.createElement('style');
            style.id = 'floatAnimation';
            style.textContent = `
                @keyframes floatUp {
                    0% {
                        transform: translateY(0) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-50px) scale(1.5);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Remove element after animation
        setTimeout(() => {
            if (icon.parentNode) {
                icon.parentNode.removeChild(icon);
            }
        }, 1000);
    }

    showNotification(message, type = 'info') {
        // Create notification
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : 'success'} position-fixed`;
        notification.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 300px;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Image Upload Manager
class ImageUploadManager {
    constructor() {
        this.init();
    }

    init() {
        const imageInput = document.getElementById('imageInput');
        const textArea = document.querySelector('textarea[name="post"]');

        if (imageInput) {
            imageInput.addEventListener('change', this.handleImageSelect.bind(this));
        }

        if (textArea) {
            textArea.addEventListener('input', this.updateCharCount.bind(this));
            // Initialize character count
            this.updateCharCount({ target: textArea });
        }
    }

    handleImageSelect(event) {
        const file = event.target.files[0];
        const preview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');

        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                this.showNotification('Por favor selecciona un archivo de imagen válido', 'error');
                event.target.value = '';
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                this.showNotification('La imagen debe ser menor a 5MB', 'error');
                event.target.value = '';
                return;
            }

            // Show preview
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImg.src = e.target.result;
                preview.style.display = 'block';
                preview.classList.add('fade-in-up');
            };
            reader.readAsDataURL(file);
        } else {
            preview.style.display = 'none';
        }
    }

    removeImage() {
        const imageInput = document.getElementById('imageInput');
        const preview = document.getElementById('imagePreview');

        if (imageInput) imageInput.value = '';
        if (preview) preview.style.display = 'none';
    }

    updateCharCount(event) {
        const textArea = event.target;
        const charCountElement = document.getElementById('charCount');
        const currentLength = textArea.value.length;

        if (charCountElement) {
            charCountElement.textContent = currentLength;

            // Change color based on character count
            if (currentLength > 120) {
                charCountElement.style.color = '#dc3545'; // Red
            } else if (currentLength > 100) {
                charCountElement.style.color = '#fd7e14'; // Orange
            } else {
                charCountElement.style.color = '#6c757d'; // Gray
            }
        }
    }

    showNotification(message, type = 'info') {
        // Create notification
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : 'success'} position-fixed`;
        notification.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 300px;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Global function for removing image (called from template)
function removeImage() {
    const manager = window.imageUploadManager;
    if (manager) {
        manager.removeImage();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new InteractionManager();
    window.imageUploadManager = new ImageUploadManager();

    // Add CSS animations for notifications
    if (!document.querySelector('#notificationAnimations')) {
        const style = document.createElement('style');
        style.id = 'notificationAnimations';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }

            .image-upload-container {
                position: relative;
            }

            .image-preview {
                text-align: center;
                padding: 1rem;
                border: 2px dashed var(--border-color);
                border-radius: 8px;
                background: var(--bg-secondary);
            }
        `;
        document.head.appendChild(style);
    }
});