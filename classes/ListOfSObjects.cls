global class ListOfSObjects extends VisualEditor.DynamicPickList {

    global override VisualEditor.DataRow getDefaultValue() {
        return new VisualEditor.DataRow('Account', 'Account');
    }

    global override VisualEditor.DynamicPickListRows getValues() {
        List<Schema.SObjectType> sObjectTypes = Schema.getGlobalDescribe().values();

        VisualEditor.DynamicPickListRows picklist = new VisualEditor.DynamicPickListRows();

        for (SObjectType objSobject : sObjectTypes) {
            String sObjectName = objSobject.getDescribe().getName();
            picklist.addRow(new VisualEditor.DataRow(sObjectName, sObjectName));
        }
        return picklist;
    }
}
