public with sharing class SalesDashboardController {

    @AuraEnabled(cacheable=true)
    public static DashboardWrapper getDashboardData(
        Date startDate,
        Date endDate,
        String ownerId,
        String stageName
    ) {

        DashboardWrapper result = new DashboardWrapper();

        String oppQuery =
            'SELECT Id, Name, Amount, StageName, CloseDate, OwnerId, Owner.Name ' +
            'FROM Opportunity WHERE Id != null';

        if(startDate != null){
            oppQuery += ' AND CloseDate >= :startDate';
        }

        if(endDate != null){
            oppQuery += ' AND CloseDate <= :endDate';
        }

        if(String.isNotBlank(ownerId)){
            oppQuery += ' AND OwnerId = :ownerId';
        }

        if(String.isNotBlank(stageName)){
            oppQuery += ' AND StageName = :stageName';
        }

        oppQuery += ' ORDER BY CloseDate DESC LIMIT 1000';

        List<Opportunity> opportunities = Database.query(oppQuery); 

        Integer openOpps = 0;
        Integer wonDeals = 0;
        Decimal pipelineAmount = 0;

        Map<String,Integer> stageCounts =
            new Map<String,Integer>();

        Map<String,Decimal> revenueByMonth =
            new Map<String,Decimal>();

        for(Opportunity opp : opportunities){

            if(opp.StageName != 'Closed Won' &&
               opp.StageName != 'Closed Lost'){
                openOpps++;
            }

            if(opp.StageName == 'Closed Won'){
                wonDeals++;
            }

            if(opp.Amount != null){
                pipelineAmount += opp.Amount;
            }

            String stage = opp.StageName;

            if(stageCounts.containsKey(stage)){
                stageCounts.put(
                    stage,
                    stageCounts.get(stage) + 1
                );
            }
            else{
                stageCounts.put(stage,1);
            }

            if(opp.Amount != null){

                String monthKey =
                    opp.CloseDate.year() +
                    '-' +
                    String.valueOf(opp.CloseDate.month());

                Decimal currentValue =
                    revenueByMonth.containsKey(monthKey)
                    ? revenueByMonth.get(monthKey)
                    : 0;

                revenueByMonth.put(
                    monthKey,
                    currentValue + opp.Amount
                );
            }
        }

        List<Account> accounts = [

            SELECT
                Id,
                Name,
                BillingStreet,
                BillingCity,
                BillingState,
                BillingPostalCode,
                BillingCountry

            FROM Account

            WHERE BillingCity != null

            LIMIT 500
        ];

        result.openOpportunities = openOpps;
        result.wonDeals = wonDeals;
        result.pipelineAmount = pipelineAmount;
        result.opportunities = opportunities;
        result.accounts = accounts;
        result.stageCounts = stageCounts;
        result.revenueByMonth = revenueByMonth;

        return result;
    }

    public class DashboardWrapper {

        @AuraEnabled
        public Integer openOpportunities;

        @AuraEnabled
        public Integer wonDeals;

        @AuraEnabled
        public Decimal pipelineAmount;

        @AuraEnabled
        public List<Opportunity> opportunities;

        @AuraEnabled
        public List<Account> accounts;

        @AuraEnabled
        public Map<String,Integer> stageCounts;

        @AuraEnabled
        public Map<String,Decimal> revenueByMonth;
    }


        @AuraEnabled(cacheable=true)
        public static List<SelectOptionWrapper> getOwners(){

            List<SelectOptionWrapper> results =
                new List<SelectOptionWrapper>();

            results.add(
                new SelectOptionWrapper('', 'All Owners')
            );

            for(User u : [
                SELECT Id, Name
                FROM User
                WHERE IsActive = true
                ORDER BY Name
            ]){

                results.add(
                    new SelectOptionWrapper(
                        u.Id,
                        u.Name
                    )
                );
            }

            return results;
        }

        public class SelectOptionWrapper{

            @AuraEnabled
            public String value;

            @AuraEnabled
            public String label;

            public SelectOptionWrapper(
                String value,
                String label
            ){
                this.value = value;
                this.label = label;
            }
        }
}