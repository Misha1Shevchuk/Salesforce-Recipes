public class LookupController {

    @TestVisible final static Integer MAX_ITEMS_TO_QUERY = 5;

    @AuraEnabled(cacheable=true)
    public static List<LookupResultWrapper> findRecords(String searchKey , String sObjectApiName, String fieldToQuery) {    
        String stringToSearch = '%' + searchKey + '%';
        
        String query = 'SELECT ' + fieldToQuery 
                    + ' FROM ' + sObjectApiName 
                    + ' WHERE ' + fieldToQuery + ' LIKE :stringToSearch'
                    + ' LIMIT :MAX_ITEMS_TO_QUERY';

        List<LookupResultWrapper> results = new List<LookupResultWrapper>();

        for (SObject record : Database.query(query)) {
            results.add(new LookupResultWrapper(record.Id, record.get(fieldToQuery)));
        }
        return results;
    }

    @AuraEnabled(cacheable=true)
    public static LookupResultWrapper findDefaultRecord(Id recordId, String fieldToQuery) {
        String sObjectApiName = recordId.getSObjectType().getDescribe().getName();

        String query = 'SELECT ' + fieldToQuery + ' FROM ' + sObjectApiName + ' WHERE Id = :recordId';

        List<SObject> records = Database.query(query);

        return records.isEmpty() ? null : new LookupResultWrapper(records[0].Id, records[0].get(fieldToQuery));
    }

    public class LookupResultWrapper {
        
        @AuraEnabled public String id;
        @AuraEnabled public String title;

        public LookupResultWrapper(String id, Object title) {
            this.id = id;
            this.title = (String)title;
        }
    }
}