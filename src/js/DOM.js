/**
 * DOM class by Johnpaul McMahon
 *
 * Tightly integrated with markup of app.
 * Controls the styling/visibility of elements
 * that make up the app.
 *
 * Imports:
 *
 */

class DOM {
    constructor() {
        // Root element
        this.rootElements = {
            app: document.getElementById("app"),
            notificationArea: document.getElementById("notification-area"),
            loadingIndicator: document.getElementById("loading-indicator"),
        };
        this.root = document.getElementById("app");
        // Elements that are part of the file upload step
        this.fileUploadElements = {
            container: document.getElementById("file-input-container"),
            input: document.getElementById("data-file"),
        };
        // Elements that are part of the required information gathering step
        this.requiredInfoElements = {
            container: document.getElementById("required-info-container"),
            button: document.getElementById("proceed-button"),
            description: document.getElementById("description"),
            claimType: document.getElementById("claim-type"),
        };
        // Current stage of the process.
        this.currentStep = 0;
        // Setup order of steps (steps are just functions)
        this.setupSteps();
    }

    // Setup the order that steps are to flow in and setup initial step.
    setupSteps() {
        // Functions for setting up the DOM for each step. Order is important
        this.steps = [() => this.fileUploadStep(), () => this.requiredInfoStep(), () => this.resultsStep()];
        // Setup current step
        this.steps[this.currentStep]();
    }

    // Advance to next step
    nextStep() {
        this.currentStep += 1;
        this.steps[this.currentStep]();
    }

    // Step Function
    fileUploadStep() {
        this.fileUploadElements.container.style.display = "block";
        this.requiredInfoElements.container.style.display = "none";
    }

    // Step Function
    requiredInfoStep() {
        this.fileUploadElements.container.style.display = "none";
        this.requiredInfoElements.container.style.display = "block";
    }

    resultsStep() {
        // this.requiredInfoElements.container.style.display = "none";
    }

    getFileInputElement() {
        return this.fileUploadElements.input;
    }

    getProceedButtonElement() {
        return this.requiredInfoElements.button;
    }

    getRequiredInfoElement(element) {
        return this.requiredInfoElements[element];
    }

    showLoadingIndicator() {
        this.rootElements.loadingIndicator.style.display = "block";
    }

    hideLoadingIndicator() {
        this.rootElements.loadingIndicator.style.display = "none";
    }

    pushNotification(message, type = "info") {
        this.rootElements.notificationArea.appendChild(
            this.createElement("div", {
                innerHTML: message,
                className: `notification is-${type}`,
            })
        );
    }

    clearNotifications() {
        this.removeAllChildrenFrom(this.rootElements.notificationArea);
    }

    // Create and return a new Element
    createElement(element, options = {}) {
        element = document.createElement(element);
        Object.keys(options).forEach(option => {
            element[option] = options[option];
        });
        return element;
    }

    // Removes all children from given Element
    removeAllChildrenFrom(element) {
        while (element.firstChild) element.removeChild(element.firstChild);
    }

    die(error) {
        console.error(error);
        this.root.innerHTML = `<div class="notification is-danger">${error}</div>`;
        this.hideLoadingIndicator();
    }
}
