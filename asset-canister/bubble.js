/**
 * Info bubble
 * v 0.3.0
 */

class Bubble {

    constructor() {

        // Element
        this.element = document.createElement('div');
        this.element.style.position = 'fixed';
        this.element.style.right = '20px';
        this.element.style.bottom = '20px';
        this.element.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this.element.style.color = 'white';
        this.element.style.padding = '16px 30px';
        this.element.style.border = '1px solid white';
        this.element.style.borderRadius = '10px';
        this.element.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
        this.element.style.fontSize = '14px';
        this.element.style.zIndex = '500';
        this.element.style.display = 'none';
        document.body.appendChild(this.element);

        // Counter
        this.interval = null;
    }

    /**
     * Show message
     */
    
    show(message) {
        this.reset();
        this.element.innerHTML = message;
        this.element.style.display = 'block';
    }

    /**
     * Hide message
     */

    hide() {
        this.reset();
        this.element.style.display = 'none';
    }

    /**
     * Counter
     * @param {string} msg: message with {{sec}} placeholder
     * @param {number} sec: seconds
     * @param {boolean} autohide: autohide after counter
     */

    counter(msg, sec, autohide) {
        this.reset();
        let remaining = sec;
        this.element.innerHTML = msg.replace('{{sec}}', remaining);
        this.element.style.display = 'block';
        this.interval = setInterval(() => {
            remaining -= 1;
            if (remaining <= 0) {
                clearInterval(this.interval);
                this.interval = null;
                if (autohide) this.element.style.display = 'none';
            } else {
                this.element.innerHTML = msg.replace('{{sec}}', remaining);
            }
        }, 1000);
    }

    /**
     * Reset counter
     */

    reset() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
    
}