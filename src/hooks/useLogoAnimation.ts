import { useState, useCallback } from 'react';

export const useLogoAnimation = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerAnimation = useCallback(() => {
    if (isAnimating) return; // Prevent multiple animations

    setIsAnimating(true);

    // Create rolling icon
    const createRollingIcon = () => {
      const rollingIcon = document.createElement('div');
      rollingIcon.className = 'rolling-icon';
      rollingIcon.innerHTML = `
        <div class="w-10 h-10 bg-gradient-to-br from-white to-gray-300 rounded-xl flex items-center justify-center shadow-lg">
          <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <circle cx="12" cy="5" r="2"></circle>
            <path d="m12 7-3 3h6l-3-3z"></path>
          </svg>
        </div>
      `;
      
      // Position at logo location
      const logoIcon = document.getElementById('logo-icon');
      if (logoIcon) {
        const rect = logoIcon.getBoundingClientRect();
        rollingIcon.style.position = 'fixed';
        rollingIcon.style.left = `${rect.left}px`;
        rollingIcon.style.top = `${rect.top}px`;
        rollingIcon.style.zIndex = '9999';
        rollingIcon.style.pointerEvents = 'none';
      }
      
      document.body.appendChild(rollingIcon);
      return rollingIcon;
    };

    // Start animation sequence
    setTimeout(() => {
      const rollingIcon = createRollingIcon();
      
      // Animate rolling across the page
      setTimeout(() => {
        rollingIcon.style.transform = 'translateX(100vw) rotate(720deg)';
        rollingIcon.style.transition = 'transform 2s cubic-bezier(0.4, 0, 0.2, 1)';
      }, 100);

      // Hide nav items and show dropdowns falling
      const navItems = document.querySelectorAll('.nav-item');
      navItems.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('nav-item-hide');
          
          // Show dropdown falling effect
          const dropdown = item.querySelector('.dropdown-menu');
          if (dropdown) {
            dropdown.classList.add('dropdown-falling');
          }
        }, 200 + (index * 100));
      });

      // Remove rolling icon and start return animation
      setTimeout(() => {
        rollingIcon.remove();
        
        // Create returning icon from left
        const returningIcon = createRollingIcon();
        returningIcon.style.left = '-60px';
        returningIcon.style.transform = 'rotate(-360deg)';
        
        setTimeout(() => {
          const logoIcon = document.getElementById('logo-icon');
          if (logoIcon) {
            const rect = logoIcon.getBoundingClientRect();
            returningIcon.style.left = `${rect.left}px`;
            returningIcon.style.transform = 'rotate(0deg)';
            returningIcon.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
          }
        }, 100);

        // Fade back nav items
        setTimeout(() => {
          navItems.forEach((item, index) => {
            setTimeout(() => {
              item.classList.remove('nav-item-hide', 'nav-item-animating');
              item.classList.add('nav-item-fade-back');
              
              // Hide dropdown falling effect
              const dropdown = item.querySelector('.dropdown-menu');
              if (dropdown) {
                dropdown.classList.remove('dropdown-falling');
              }
            }, index * 80);
          });
        }, 800);

        // Clean up returning icon
        setTimeout(() => {
          returningIcon.remove();
        }, 1100);

        // Reset all states
        setTimeout(() => {
          navItems.forEach(item => {
            item.classList.remove('nav-item-fade-back');
          });
          setIsAnimating(false);
        }, 2000);
      }, 2200);
    }, 300);
  }, [isAnimating]);

  return { isAnimating, triggerAnimation };
};