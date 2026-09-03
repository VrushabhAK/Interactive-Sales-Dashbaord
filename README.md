# Interactive Sales Dashboard with Charts & Maps

## Overview

The Interactive Sales Dashboard is a Salesforce Lightning Web Component (LWC) application that provides a consolidated view of sales performance through KPI cards, interactive charts, account location mapping, and dynamic filtering capabilities.

The solution leverages Apex, Lightning Web Components, Chart.js, Lightning Map, and Salesforce Lightning Design System (SLDS) to deliver a responsive and user-friendly dashboard experience.

---

## Features

### KPI Metrics

* Open Opportunities
* Won Deals
* Pipeline Revenue

### Interactive Charts

* Opportunity Stage Distribution (Bar Chart)
* Revenue Trend Analysis (Line Chart)

### Account Location Map

* Interactive account location visualization
* Powered by Lightning Map
* Displays account locations based on billing address information

### Dashboard Filters

* Date Range Filter
* Stage Filter
* Owner Filter
* Real-time dashboard refresh

### Responsive Design

* SLDS compliant
* Responsive chart rendering

### Dynamic UI Features

* Conditional rendering for custom date filters
* Dynamic CSS styling for KPI metrics
* Real-time chart updates

---

## Technology Stack

### Salesforce

* Lightning Web Components (LWC)
* Apex
* Lightning Data Service
* Salesforce Wire Service

### Third-Party Libraries

* Chart.js

### UI Framework

* Salesforce Lightning Design System (SLDS)

---

## Project Structure

```text
force-app
└── main
    └── default
        ├── classes
        │   ├── SalesDashboardController.cls
        │   └── SalesDashboardControllerTest.cls
        │
        └── lwc
            ├── salesDashboard
            ├── metricCard
            ├── stageChart
            ├── revenueChart
            └── accountMap

## Scratch Org Deployment

### 1. Clone Repository

```bash
git clone <repository-url>
cd SalesDashboard
```

### 2. Authenticate Dev Hub

```bash
sf org login web --set-default-dev-hub
```

### 3. Create Scratch Org

```bash
sf org create scratch \
--definition-file config/project-scratch-def.json \
--alias SalesDashboard \
--duration-days 30
```

### 4. Set Default Org

```bash
sf config set target-org SalesDashboard
```

### 5. Deploy Metadata

```bash
sf project deploy start
```

### 6. Open Scratch Org

```bash
sf org open
```



## Test Execution

Run Apex Tests:

```bash
sf apex run test \
--class-names SalesDashboardControllerTest \
--result-format human
```

Expected Result:

```text
Pass Rate: 100%
```

---

## Test Data Creation

### Create Sample Accounts

Execute Anonymous Apex:

```apex
insert new Account(
    Name = 'Coca Cola Atlanta',
    BillingStreet = '1 Coca Cola Plaza',
    BillingCity = 'Atlanta',
    BillingState = 'GA',
    BillingCountry = 'USA'
);

insert new Account(
    Name = 'Pepsi Chicago',
    BillingStreet = '700 W Chicago Ave',
    BillingCity = 'Chicago',
    BillingState = 'IL',
    BillingCountry = 'USA'
);
```

### Create Sample Opportunities

Execute Anonymous Apex:

```apex
Account acc = [
    SELECT Id
    FROM Account
    LIMIT 1
];

List<Opportunity> opps = new List<Opportunity>();

opps.add(new Opportunity(
    Name='Prospecting Deal',
    AccountId=acc.Id,
    StageName='Prospecting',
    CloseDate=Date.today().addDays(30),
    Amount=50000
));

opps.add(new Opportunity(
    Name='Closed Won Deal',
    AccountId=acc.Id,
    StageName='Closed Won',
    CloseDate=Date.today(),
    Amount=150000
));

insert opps;
```

---

## Running the Application

### Lightning App Builder

1. Open Setup
2. Navigate to Lightning App Builder
3. Create a Lightning App Page
4. Drag the **Sales Dashboard** component onto the page
5. Save and Activate

### App Launcher

Open the dashboard page from the App Launcher after activation.

---

## Dashboard Components

### Metric Card

Reusable KPI card component built using LWC slots.

### Stage Chart

Displays Opportunity distribution by Stage using Chart.js.

### Revenue Chart

Displays Revenue Trend over time using Chart.js.

### Account Map

Displays Account locations using Lightning Map.

### Dashboard Filters

Provides filtering by:

* Date Range
* Owner
* Stage

---


## Future Enhancements

* Lightning Messaging Service (LMS) integration
* Export to CSV
* Opportunity drill-down table
* Advanced analytics widgets
* Scheduled dashboard refresh


