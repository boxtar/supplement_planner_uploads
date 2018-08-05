/**
 * Johnpaul McMahon
 * Supplementary budget uploading helper script
 *
 * Imports:
 * import DOM from "./DOM.js"
 * import Store from "./Store.js"
 * import App from "./App.js"
 *
 */

// Create a store instance for App
let store = new Store({
    claimType: undefined,
    description: undefined,
    inputFields: {
        project: "Project",
        subProject: "Sub Project",
        period: "Period",
        resbud: "Fin Bud Head",
        fecBudget: "FEC",
        priceBudget: "Price",
    },
    outputFields: {
        version: "Version",
        resbud: "Resbud",
        resbudText: "Resbud(T)",
        subProject: "Sub Project",
        amount: "Amount",
        period: "Period",
        description: "Description",
    },
    claimTypes: {
        costsInc: "costs-inc",
        profile: "profile",
        fixed: "fixed"
    },
    resbudMap: {
        XI10: "Animals",
        XU10: "Consumables",
        XP10: "Contingencies",
        XU11: "DA Consumables",
        XE11: "DA Equipment Maintenance",
        XE10: "Equipment",
        XF10: "Equipment Large Capital",
        XZ11: "Estates Costs",
        XQ10: "Exceptional Items",
        XZ90: "Income",
        XZ10: "Indirects",
        XS10: "Market Assessment",
        XW10: "Others",
        XJ10: "Patents",
        XA10: "Salaries - Clinical Academic",
        XA19: "Salary Recoups - Clinical",
        XA20: "Salaries - Research",
        XA29: "Salary Recoups - Research",
        XA30: "Salaries - Technical & Related",
        XA39: "Salary Recoups - Technical & Related",
        XA40: "Salaries - Modernisation of Pay",
        XA49: "Salary Recoups - Modernisation of Pay",
        XA50: "Salaries - Administrative",
        XA59: "Salary Recoups - Administrative",
        XA60: "Salaries - Others",
        XA69: "Salary Recoups - Others",
        XK10: "Sponsored Refurbishment",
        XG10: "Studentships",
        XT10: "Student Matric Fees",
        XR10: "Subcontract Costs",
        XZ12: "Technician Infrastructure Costs",
        XN10: "Travel Overseas",
        XM10: "Travel UK",
    },
});

// Kick-off (store defined in Store.js)
const app = new App(new DOM(), store);
