/**
 * App class by Johnpaul McMahon
 *
 * There should only be 1 instance of this class.
 * It will receive a store object from instantiator
 * and will control the displaying and updating of all
 * data.
 *
 * Imports:
 * import DataCollection from DataCollection.js
 */

class App {
    constructor(dom, store) {
        this.dom = dom;
        this.data = [];
        this.store = store;
        this.fields = this.store.getState("inputFields");
        this.fileSelectHandler = e => this.handleFileSelect(e);
        this.setupEventListeners();
    }

    setupEventListeners() {
        try {
            // Check for the various File API support.
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                // When a file is chosen, the process kicks off from handleFileSelect function
                this.dom.getFileInputElement().addEventListener("change", this.fileSelectHandler, false);
            } else {
                throw "File API not supported by your browser <i>(Google Chrome is the best)</i>";
            }
        } catch (error) {
            this.dom.die(error);
        }
    }

    handleFileSelect(e) {
        // Show loading bar as we're going to be processing the file.
        this.dom.showLoadingIndicator();
        // Setup next stage.
        this.dom.nextStep();
        try {
            let files = e.target.files; // FileList object
            if (files.length > 0) {
                if (files[0].name.split(".").pop() !== "csv")
                    throw "File must be of CSV format and have .csv extension";
                // Use Papa to parse CSV file:
                Papa.parse(files[0], {
                    complete: (results, file) => this.processInput(results.data),
                    skipEmptyLines: true,
                    header: true,
                    dynamicTyping: true,
                });
            } else {
                throw "No file chosen. Please refresh and try again...";
            }
        } catch (error) {
            this.dom.die(error);
        }
    }

    processInput(input) {
        // Sub Project of record in current iteration of loop below.
        let currSp;
        // Filters existing Sub Projects based on currSp to decide
        // if new Sub Project is required.
        let spMatch;
        // Loop through every record
        input.forEach(r => {
            // Skip blanks
            if (r[this.fields.period] !== "") {
                // Sometimes the input has no sub-project. Make sure we handle that situation.
                if ((currSp = r[this.fields.subProject]) === "") currSp = r[this.fields.project] + "-01";
                // filter through existing SubProject instances in search for currSp.
                spMatch = this.data.filter(sp => sp.getCode() === currSp);
                if (spMatch.length > 1) {
                    // Duplicated Sub project? Not possible! Throw err.
                    throw "Duplicated Sub-projects. Logic error.";
                } else if (spMatch.length === 0) {
                    // If length of filtered array is 0 then new Sub project to be added.
                    currSp = new SubProject(currSp, this.store);
                    this.data.push(currSp);
                } else {
                    // If length of spMatch != 0 and !> 1 then must be 1.
                    // So we have a match. Reference it for use below.
                    currSp = spMatch[0];
                }
                // Add current iteration's record to the matched (or created) Sub Project.
                currSp.addRecord(r);
            }
        });
        // Input processed. Hide Loading Bar.
        this.dom.hideLoadingIndicator();
        // Remove file input handler as that is gone now.
        this.dom.getFileInputElement().removeEventListener("change", this.fileSelectHandler);
        // Add click handler to proceed button for processing results.
        this.dom.getProceedButtonElement().addEventListener("click", () => this.proceed(), false);
        // Activate the proceed button.
        this.dom.getProceedButtonElement().disabled = false;
    }

    proceed() {
        this.dom.clearNotifications();

        if (!this.setDescription()) return;
        if (!this.setClaimType()) return;

        // Begin processing results
        this.dom.showLoadingIndicator();
        this.dom.pushNotification("Processing...");

        // Build and download CSV
        this.downloadCsv(this.buildCsvString());

        this.dom.hideLoadingIndicator();
        this.dom.clearNotifications();
        this.dom.pushNotification("Complete. Results will be in your download folder", "success");
    }

    // Sets description in store or returns false if validation fails.
    setDescription() {
        let description = this.dom.getRequiredInfoElement("description").value;
        // Some quick and lazy error checking
        if (description.length == 0) {
            this.notifyInvalidDescription();
            return false;
        }
        this.store.setState("description", description);
        return true;
    }

    // Sets the claim type in the store.
    setClaimType() {
        this.store.setState("claimType", this.dom.getRequiredInfoElement("claimType").value);
        return true;
    }

    buildCsvString() {
        let csv = "data:text/csv;charset=utf-8,";
        csv +=
            [
                this.store.getState("outputFields").version,
                this.store.getState("outputFields").resbud,
                this.store.getState("outputFields").resbudText,
                this.store.getState("outputFields").subProject,
                this.store.getState("outputFields").amount,
                this.store.getState("outputFields").period,
                this.store.getState("outputFields").description,
            ].join(",") + ",\r\n";
        csv += this.data.reduce((prev, curr) => {
            return (prev += curr.getResults().reduce((prev, curr) => {
                return (prev += curr.join(",") + ",\r\n");
            }, ""));
        }, "");
        return csv;
    }

    downloadCsv(csv) {
        let link = this.dom.createElement("a", {
            href: encodeURI(csv),
            download: `${this.data[0].getCode().substring(0, 6)}_${Date.now()}_${this.store.getState(
                "claimType"
            )}.csv`,
            innerHTML: "Download",
            style: "display: none",
        });
        document.body.appendChild(link);
        link.click();
    }

    notifyInvalidDescription() {
        this.dom.pushNotification("The description cannot be empty", "danger");
    }
}
