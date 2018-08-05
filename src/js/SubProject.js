/**
 * SubProject class by Johnpaul McMahon
 *
 * Controls data associated with a sub-project
 *
 * Imports:
 *
 */

class SubProject {
    constructor(code, store) {
        this.code = code;
        this.data = [];
        this.income = {};
        this.results = [];
        this.store = store;
        this.fields = this.store.getState("inputFields");
        this.resbudMap = this.store.getState("resbudMap");
        this.versions = {
            fec: "PBFEC",
            price: "PBPRICE",
        };
    }

    getCode() {
        return this.code;
    }

    addRecord(record) {
        this.data.push({
            [this.fields.resbud]: record[this.fields.resbud],
            [this.fields.subProject]: this.getCode(),
            [this.fields.fecBudget]: record[this.fields.fecBudget],
            [this.fields.priceBudget]: record[this.fields.priceBudget],
            [this.fields.period]: record[this.fields.period],
        });
    }

    getResults() {
        this.results = [];
        // Loop over each record in intial data
        this.data.forEach(r => {
            this.pushToIncome(r[this.fields.priceBudget], r[this.fields.period]);
            // Push FEC entry
            this.results.push(this.extractFECInfo(r));
            // Push Price entry, if applicable
            if (this.store.getState("claimType") !== "fixed") {
                this.results.push(this.extractPriceInfo(r));
            }
        });
        // Add FEC Income entries onto results
        this.pushIncomeToResults(r => this.extractFECInfo(r));
        // If claim type is Fixed then PB/IBPRICE budget should all be under Income
        if (this.store.getState("claimType") === "fixed")
            this.pushIncomeToResults(r => this.extractPriceInfo(r));

        return this.results;
    }

    pushToIncome(amount, period) {
        // This is for the FEC Income contra entry
        if (this.income[period] === undefined) {
            this.income[period] = amount * -1;
        } else {
            this.income[period] -= amount;
        }
    }

    pushIncomeToResults(handler) {
        // Non changing values
        let record = {
            [this.fields.resbud]: "XZ90",
            [this.fields.subProject]: this.getCode(),
        };
        Object.keys(this.income).forEach(period => {
            record[this.fields.period] = period;
            record[this.fields.priceBudget] = this.income[period] * -1;
            record[this.fields.fecBudget] = this.income[period];
            this.results.push(handler(record));
        });
    }

    extractFECInfo(record) {
        return this.extract(record, this.versions.fec);
    }

    extractPriceInfo(record) {
        return this.extract(record, this.versions.price);
    }

    extract(record, type) {
        return [
            type,
            record[this.fields.resbud],
            this.resbudMap[record[this.fields.resbud]],
            record[this.fields.subProject],
            type == this.versions.fec ? record[this.fields.fecBudget] : record[this.fields.priceBudget],
            record[this.fields.period],
            this.store.getState("description"),
        ];
    }
}
