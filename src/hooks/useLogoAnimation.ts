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

      // Position at logo location
      const logoIcon = document.getElementById('logo-icon');
      if (logoIcon) {
        const rect = logoIcon.getBoundingClientRect();
        rollingIcon.style.position = 'fixed';
        rollingIcon.style.left = `${rect.left}px`;
        rollingIcon.style.top = `${rect.top}px`;
        rollingIcon.style.width = `${rect.width}px`;
        rollingIcon.style.height = `${rect.height}px`;
        rollingIcon.style.zIndex = '9999';
        rollingIcon.style.pointerEvents = 'none';

        const clonedLogo = logoIcon.cloneNode(true) as HTMLElement;
        clonedLogo.removeAttribute('id');
        clonedLogo.removeAttribute('data-nav-item');
        clonedLogo.style.pointerEvents = 'none';
        clonedLogo.classList.remove(
          'cursor-pointer',
          'logo-scared',
          'logo-hidden',
          'nav-item',
          'nav-brand-icon'
        );
        if (!clonedLogo.classList.contains('logo-normal')) {
          clonedLogo.classList.add('logo-normal');
        }

        rollingIcon.appendChild(clonedLogo);
      }
      
      document.body.appendChild(rollingIcon);
      return rollingIcon;
    };

    // Start animation sequence
    setTimeout(() => {
      const rollingIcon = createRollingIcon();
      
      // Animate rolling across the page
      setTimeout(() => {
        rollingIcon.style.transition = 'transform 2s cubic-bezier(0.4, 0, 0.2, 1)';
        // Force layout to ensure transition is applied before transform change
        void rollingIcon.offsetWidth;
        rollingIcon.style.transform = 'translateX(100vw) rotate(720deg)';
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
            returningIcon.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
            void returningIcon.offsetWidth;
            returningIcon.style.left = `${rect.left}px`;
            returningIcon.style.transform = 'rotate(0deg)';
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