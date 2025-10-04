import { requireAuth } from "./util/auth.js";
import { loginButton } from "./interface/navbarLoginButton.js";

// Module progress tracking
class AdvancedModuleProgress {
    constructor() {
        this.moduleId = 'advanced-javascript';
        this.sections = [
            'intro', 'closures', 'promises', 'async', 
            'prototypes', 'modules', 'destructuring', 'summary'
        ];
        this.completed = this.getProgress();
        this.init();
    }

    init() {
        this.setupSectionObserver();
        this.setupInteractiveElements();
        this.updateProgressUI();
        this.setupNavigationHandlers();
    }

    setupSectionObserver() {
        const options = {
            root: null,
            rootMargin: '-20% 0px -80% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.markSectionAsViewed(entry.target.id);
                    this.updateActiveNavLink(entry.target.id);
                }
            });
        }, options);

        // Observe all sections
        this.sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                observer.observe(section);
            }
        });
    }

    setupInteractiveElements() {
        // Promise demo button
        const promiseDemo = document.getElementById('promise-demo');
        const promiseOutput = document.getElementById('promise-output');

        if (promiseDemo && promiseOutput) {
            promiseDemo.addEventListener('click', () => {
                promiseOutput.innerHTML = '<div class="text-blue-600">Loading...</div>';
                
                // Simulate async operation
                const demoPromise = new Promise((resolve) => {
                    setTimeout(() => {
                        resolve('Promise resolved successfully! 🎉');
                    }, 2000);
                });

                demoPromise.then(result => {
                    promiseOutput.innerHTML = `
                        <div class="text-green-600 font-medium">${result}</div>
                        <div class="text-xs text-gray-500 mt-2">This promise took 2 seconds to resolve.</div>
                    `;
                });
            });
        }

        // Quick action buttons
        this.setupQuickActions();
    }

    setupQuickActions() {
        // Save progress button
        const saveBtn = document.querySelector('[data-action="save"]') || 
                       document.querySelector('button:has(span:contains("💾"))');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveProgress();
                this.showNotification('Progress saved!', 'success');
            });
        }

        // Bookmark button
        const bookmarkBtn = document.querySelector('[data-action="bookmark"]') ||
                           document.querySelector('button:has(span:contains("🔖"))');
        if (bookmarkBtn) {
            bookmarkBtn.addEventListener('click', () => {
                this.toggleBookmark();
            });
        }

        // Help button
        const helpBtn = document.querySelector('[data-action="help"]') ||
                       document.querySelector('button:has(span:contains("💬"))');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => {
                this.showHelpModal();
            });
        }
    }

    setupNavigationHandlers() {
        // Smooth scroll for table of contents
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Next/Previous section navigation
        const nextBtn = document.querySelector('button:has(span:contains("Next:"))');
        const prevBtn = document.querySelector('button:has(span:contains("Previous:"))');

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.navigateToNextSection();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.navigateToPreviousSection();
            });
        }
    }

    markSectionAsViewed(sectionId) {
        if (!this.completed.includes(sectionId)) {
            this.completed.push(sectionId);
            this.saveProgress();
            this.updateProgressUI();
            this.updateSectionStatus(sectionId);
        }
    }

    updateActiveNavLink(sectionId) {
        // Update table of contents active state
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.classList.remove('text-blue-600', 'font-medium');
            link.classList.add('text-gray-600');
        });

        const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.remove('text-gray-600');
            activeLink.classList.add('text-blue-600', 'font-medium');
        }

        // Update sidebar progress
        this.updateSidebarProgress(sectionId);
    }

    updateSidebarProgress(currentSection) {
        const progressItems = document.querySelectorAll('aside .space-y-3 > div');
        progressItems.forEach((item, index) => {
            const dot = item.querySelector('div');
            const text = item.querySelector('span');
            const sectionId = this.sections[index];

            if (this.completed.includes(sectionId)) {
                dot.className = 'w-4 h-4 bg-green-500 rounded-full flex-shrink-0';
                text.className = 'text-sm text-gray-700';
            } else if (sectionId === currentSection) {
                dot.className = 'w-4 h-4 bg-blue-500 rounded-full flex-shrink-0';
                text.className = 'text-sm font-medium text-blue-700';
            } else {
                dot.className = 'w-4 h-4 bg-gray-300 rounded-full flex-shrink-0';
                text.className = 'text-sm text-gray-500';
            }
        });
    }

    updateProgressUI() {
        const progressPercentage = (this.completed.length / this.sections.length) * 100;
        
        // Update main progress bar
        const progressBar = document.querySelector('.bg-blue-500');
        if (progressBar) {
            progressBar.style.width = `${progressPercentage}%`;
        }

        // Update progress text
        const progressText = document.querySelector('span:contains("% Complete")');
        if (progressText) {
            progressText.textContent = `${Math.round(progressPercentage)}% Complete`;
        }

        // Update sections completed text
        const sectionsText = document.querySelector('span:contains("of 8 sections")');
        if (sectionsText) {
            sectionsText.textContent = `${this.completed.length} of ${this.sections.length} sections`;
        }

        // Calculate estimated time remaining
        const avgTimePerSection = 6; // minutes
        const remainingSections = this.sections.length - this.completed.length;
        const timeRemaining = remainingSections * avgTimePerSection;
        
        const timeText = document.querySelector('span:contains("min left")');
        if (timeText) {
            timeText.textContent = `~${timeRemaining} min left`;
        }
    }

    updateSectionStatus(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const statusElement = section.querySelector('.flex.items-center.space-x-2');
            if (statusElement) {
                statusElement.innerHTML = `
                    <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span class="text-sm text-green-600 font-medium">Completed</span>
                `;
            }
        }
    }

    navigateToNextSection() {
        const currentSection = this.getCurrentSection();
        const currentIndex = this.sections.indexOf(currentSection);
        const nextIndex = Math.min(currentIndex + 1, this.sections.length - 1);
        const nextSection = this.sections[nextIndex];
        
        document.getElementById(nextSection)?.scrollIntoView({
            behavior: 'smooth'
        });
    }

    navigateToPreviousSection() {
        const currentSection = this.getCurrentSection();
        const currentIndex = this.sections.indexOf(currentSection);
        const prevIndex = Math.max(currentIndex - 1, 0);
        const prevSection = this.sections[prevIndex];
        
        document.getElementById(prevSection)?.scrollIntoView({
            behavior: 'smooth'
        });
    }

    getCurrentSection() {
        // Find which section is currently visible
        for (const sectionId of this.sections) {
            const section = document.getElementById(sectionId);
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 200 && rect.bottom >= 200) {
                    return sectionId;
                }
            }
        }
        return this.sections[0];
    }

    saveProgress() {
        localStorage.setItem(`module_progress_${this.moduleId}`, JSON.stringify({
            completed: this.completed,
            lastVisited: new Date().toISOString(),
            totalSections: this.sections.length
        }));
    }

    getProgress() {
        const saved = localStorage.getItem(`module_progress_${this.moduleId}`);
        if (saved) {
            const data = JSON.parse(saved);
            return data.completed || [];
        }
        return [];
    }

    toggleBookmark() {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarked_modules') || '[]');
        const isBookmarked = bookmarks.includes(this.moduleId);
        
        if (isBookmarked) {
            const index = bookmarks.indexOf(this.moduleId);
            bookmarks.splice(index, 1);
            this.showNotification('Bookmark removed', 'info');
        } else {
            bookmarks.push(this.moduleId);
            this.showNotification('Module bookmarked!', 'success');
        }
        
        localStorage.setItem('bookmarked_modules', JSON.stringify(bookmarks));
    }

    showHelpModal() {
        // Create a simple help modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl p-8 max-w-md mx-4">
                <h3 class="text-xl font-bold text-gray-900 mb-4">Need Help?</h3>
                <p class="text-gray-600 mb-6">
                    If you're stuck on any concept or need clarification, here are some resources:
                </p>
                <div class="space-y-3 mb-6">
                    <div class="flex items-center space-x-3">
                        <span class="text-blue-500">📚</span>
                        <span class="text-sm">Review previous sections</span>
                    </div>
                    <div class="flex items-center space-x-3">
                        <span class="text-green-500">💬</span>
                        <span class="text-sm">Join our community forum</span>
                    </div>
                    <div class="flex items-center space-x-3">
                        <span class="text-purple-500">🎥</span>
                        <span class="text-sm">Watch video explanations</span>
                    </div>
                </div>
                <button class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                    Close
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.tagName === 'BUTTON') {
                document.body.removeChild(modal);
            }
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-500'
        };
        
        notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-transform transform translate-x-full`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    requireAuth();
    loginButton();
    new AdvancedModuleProgress();
});

// Add some CSS for smooth scrolling and custom styles
const style = document.createElement('style');
style.textContent = `
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    
    .section-content {
        scroll-margin-top: 120px;
    }
    
    .prose code {
        background-color: #f3f4f6;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.875em;
    }
`;
document.head.appendChild(style);