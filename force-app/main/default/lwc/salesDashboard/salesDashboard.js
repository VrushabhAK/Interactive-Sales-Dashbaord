import { LightningElement, wire } from 'lwc';
import getDashboardData from '@salesforce/apex/SalesDashboardController.getDashboardData';
import { refreshApex } from '@salesforce/apex';
import getOwners from '@salesforce/apex/SalesDashboardController.getOwners';

export default class SalesDashboard extends LightningElement {

    openOpps = 0;
    wonDeals = 0;
    pipelineAmount = 0;
    selectedOwner = '';
    ownerOptions = [];

    stageCounts = {};
    revenueByMonth = {};
    accounts = [];

    startDate;
    endDate;

    selectedStage = '';

    dateRange = 'LAST_30_DAYS';
    showCustomDates = false;

    myName = '';
    myCustomInput = '';

    wiredResult;

    stageOptions = [
        { label: 'All Stages', value: '' },
        { label: 'Prospecting', value: 'Prospecting' },
        { label: 'Qualification', value: 'Qualification' },
        { label: 'Needs Analysis', value: 'Needs Analysis' },
        { label: 'Value Proposition', value: 'Value Proposition' },
        { label: 'Proposal/Price Quote', value: 'Proposal/Price Quote' },
        { label: 'Closed Won', value: 'Closed Won' },
        { label: 'Closed Lost', value: 'Closed Lost' }
    ];

    dateRangeOptions = [
        { label: 'All', value: 'ALL' },
        { label: 'Today', value: 'TODAY' },
        { label: 'Last 7 Days', value: 'LAST_7_DAYS' },
        { label: 'Last 30 Days', value: 'LAST_30_DAYS' },
        { label: 'This Month', value: 'THIS_MONTH' },
        { label: 'Last Month', value: 'LAST_MONTH' },
        { label: 'This Quarter', value: 'THIS_QUARTER' },
        { label: 'This Year', value: 'THIS_YEAR' },
        { label: 'Custom', value: 'CUSTOM' }
    ];
    

    @wire(getOwners)
        wiredOwners({data}){

            if(data){
                this.ownerOptions = data;
            }
        }

    @wire(getDashboardData, {
        startDate: '$startDate',
        endDate: '$endDate',
        ownerId: '$selectedOwner',
        stageName: '$selectedStage'
    })
    wiredDashboard(result) {

        this.wiredResult = result;

        const { data, error } = result;

        if (data) {

            this.openOpps = data.openOpportunities;
            this.wonDeals = data.wonDeals;
            this.pipelineAmount = data.pipelineAmount;

            this.stageCounts = data.stageCounts;
            this.revenueByMonth = data.revenueByMonth;
            this.accounts = data.accounts;
        }
        else if (error) {
            console.error(error);
        }
    }

    connectedCallback() {
        this.applyDateRange();
    }

    handleDateRangeChange(event) {

        this.dateRange = event.detail.value;

        this.showCustomDates =
            this.dateRange === 'CUSTOM';

        if (!this.showCustomDates) {
            this.applyDateRange();
        }
    }

    handleStartDate(event) {
        this.startDate = event.target.value;
    }

    handleEndDate(event) {
        this.endDate = event.target.value;
    }

    handleStageChange(event) {
        this.selectedStage = event.detail.value;
    }

    handleRefresh() {

        if (this.dateRange !== 'CUSTOM') {
            this.applyDateRange();
        }

        refreshApex(this.wiredResult)
            .then(() => {
                console.log('Dashboard refreshed');
            })
            .catch(error => {
                console.error(error);
            });
    }
    handleOwnerChange(event){
        this.selectedOwner =
            event.detail.value;
    }

    applyDateRange() {

        const today = new Date();

        let start;
        let end = new Date(today);

        switch (this.dateRange) {

            case 'TODAY':
                start = new Date(today);
                break;

            case 'LAST_7_DAYS':
                start = new Date(today);
                start.setDate(today.getDate() - 7);
                break;

            case 'LAST_30_DAYS':
                start = new Date(today);
                start.setDate(today.getDate() - 30);
                break;

            case 'THIS_MONTH':
                start = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    1
                );
                break;

            case 'LAST_MONTH':
                start = new Date(
                    today.getFullYear(),
                    today.getMonth() - 1,
                    1
                );

                end = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    0
                );
                break;

            case 'THIS_QUARTER':

                const quarter =
                    Math.floor(today.getMonth() / 3);

                start = new Date(
                    today.getFullYear(),
                    quarter * 3,
                    1
                );
                break;

            case 'THIS_YEAR':

                start = new Date(
                    today.getFullYear(),
                    0,
                    1
                );
                break;

            case 'ALL':

                this.startDate = null;
                this.endDate = null;
                return;

            default:
                return;
        }

        this.startDate =
            start.toISOString().split('T')[0];

        this.endDate =
            end.toISOString().split('T')[0];
    }

    get revenueClass() {

        return this.pipelineAmount > 500000
            ? 'metric-green'
            : 'metric-orange';
    }

    handleNameChange(event) {
        this.myName = event.detail;
    }

    handleInputChange(event){
        this.myCustomInput = event.detail;
    }

}