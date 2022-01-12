@IsTest
private class LookupControllerTest {

    final static String ACCOUNT_NAME = 'Test Account';

    @TestSetup
    static void setup() {
        insert new List<Account>{
            new Account(Name = 'Facebook'),
            new Account(Name = 'Amazon'),
            new Account(Name = 'Apple'),
            new Account(Name = 'Netflix'),
            new Account(Name = 'Google'),
            new Account(Name = 'Salesforce')
        };
    }
    
    @isTest
    static void findRecords_passFullAccountName_shouldFindRecord() {
        Test.startTest();
            List<LookupController.LookupResultWrapper> results = 
                LookupController.findRecords('Salesforce', 'Account', 'Name');
        Test.stopTest();

        System.assertEquals(1, results.size(), 'Should return only 1 record.');
        System.assertEquals(results.get(0).title, 'Salesforce', 'title should be "Salesforce"');
    }

    @isTest
    static void findRecords_passPartOfAccountName_shouldFindRecord() {
        Test.startTest();
            List<LookupController.LookupResultWrapper> results = LookupController.findRecords('sfo', 'Account', 'Name');
        Test.stopTest();

        System.assertEquals(1, results.size(), 'Should return only 1 record.');
        System.assertEquals('Salesforce', results.get(0).title, 'title should be "Salesforce"');
    }

    @isTest
    static void findRecords_passAccountNameInUpperCase_shouldFindRecord() {
        Test.startTest();
            List<LookupController.LookupResultWrapper> results = LookupController.findRecords('APPLE', 'Account', 'Name');
        Test.stopTest();

        System.assertEquals(1, results.size(), 'Should return only 1 record.');
        System.assertEquals('Apple', results.get(0).title, 'title should be "Apple"');
    }

    @isTest
    static void findRecords_passWrongName_shouldNotFindRecord() {
        Test.startTest();
            List<LookupController.LookupResultWrapper> results = LookupController.findRecords('XYZ', 'Account', 'Name');
        Test.stopTest();

        System.assertEquals(0, results.size(), 'Should return 0 records.');
    }

    @isTest
    static void findRecords_passEmptyName_shouldReturnManyRecords() {
        Test.startTest();
            List<LookupController.LookupResultWrapper> results = LookupController.findRecords('', 'Account', 'Name');
        Test.stopTest();

        System.assertEquals(
            LookupController.MAX_ITEMS_TO_QUERY, results.size(), 
            'Should return ' + LookupController.MAX_ITEMS_TO_QUERY + ' records.'
        );
    }

    @isTest
    static void findRecords_passNullAsName_shouldNotReturnRecords() {
        Test.startTest();
            List<LookupController.LookupResultWrapper> results = LookupController.findRecords(null, 'Account', 'Name');
        Test.stopTest();

        System.assertEquals(0, results.size(), 'Should return 0 records.');
    }

    @isTest
    static void findRecords_passWrongSObjectName_shouldThrowError() {
        Boolean hasError = false;

        Test.startTest();
            try {
                LookupController.findRecords('', 'WrongObject', 'Name');
            } catch(Exception e) {
                hasError = true;
            }
        Test.stopTest();

        System.assert(hasError, 'Exception should be thrown');
    }

    @isTest
    static void findRecords_passNullAsSObjectName_shouldThrowError() {
        Boolean hasError = false;

        Test.startTest();
            try {
                LookupController.findRecords('', null, 'Name');
            } catch(Exception e) {
                hasError = true;
            }
        Test.stopTest();

        System.assert(hasError, 'Exception should be thrown');
    }

    @isTest
    static void findRecords_passWrongFieldName_shouldThrowError() {
        Boolean hasError = false;

        Test.startTest();
            try {
                LookupController.findRecords('', 'Account', 'WrongField');
            } catch(Exception e) {
                hasError = true;
            }
        Test.stopTest();

        System.assert(hasError, 'Exception should be thrown');
    }

    @isTest
    static void findRecords_passNullAsFieldName_shouldThrowError() {
        Boolean hasError = false;

        Test.startTest();
            try {
                LookupController.findRecords('', 'Account', null);
            } catch(Exception e) {
                hasError = true;
            }
        Test.stopTest();

        System.assert(hasError, 'Exception should be thrown');
    }

    @isTest
    static void findDefaultRecord_passIdAndField_shouldReturnRecord() {
        Account account = [SELECT Name FROM Account WHERE Name = 'Netflix' LIMIT 1];

        Test.startTest();
            LookupController.LookupResultWrapper result = LookupController.findDefaultRecord(account.Id, 'Name');
        Test.stopTest();

        System.assertEquals(account.Name, result.title);
    }

    @isTest
    static void findDefaultRecord_passEmptyStringAsId_shouldThrowError() {
        Boolean hasError = false;

        Test.startTest();
            try {
                LookupController.findDefaultRecord('', 'Name');
            } catch(Exception e) {
                hasError = true;
            }
        Test.stopTest();

        System.assert(hasError, 'Exception should be thrown');
    }

    @isTest
    static void findDefaultRecord_passNullAsId_shouldThrowError() {
        Boolean hasError = false;

        Test.startTest();
            try {
                LookupController.findDefaultRecord(null, 'Name');
            } catch(Exception e) {
                hasError = true;
            }
        Test.stopTest();

        System.assert(hasError, 'Exception should be thrown');
    }

    @isTest
    static void findDefaultRecord_passWrongFieldName_shouldThrowError() {
        Account account = [SELECT Name FROM Account WHERE Name = 'Netflix' LIMIT 1];
        Boolean hasError = false;

        Test.startTest();
            try {
                LookupController.findDefaultRecord(account.Id, 'WrongFieldName');
            } catch(Exception e) {
                hasError = true;
            }
        Test.stopTest();

        System.assert(hasError, 'Exception should be thrown');
    }

    @isTest
    static void findDefaultRecord_passNullAsFieldName_shouldThrowError() {
        Account account = [SELECT Name FROM Account WHERE Name = 'Netflix' LIMIT 1];
        Boolean hasError = false;

        Test.startTest();
            try {
                LookupController.findDefaultRecord(account.Id, null);
            } catch(Exception e) {
                hasError = true;
            }
        Test.stopTest();

        System.assert(hasError, 'Exception should be thrown');
    }
}
