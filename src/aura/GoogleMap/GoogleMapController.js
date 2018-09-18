/**
 * @author Tiaan Swart (tiaan@cloudinit.nz)
 * @date 2018-09-18
 * @description
 *
 * CHANGE LOG
 * 2018-09-18 - Initial setup
 **/
({

    doInit: function (component, event, helper) {

        // Reset Waypoints
        component.set('v.waypointAddresses', []);
        // Get the VF URL
        var vfGoogleMapURL = component.get('v.vfGoogleMapURL');

        helper.showWaiting(component);

        // If we have the VF URL
        if (vfGoogleMapURL) {

            // Add an event listener for any messages posted to this component
            window.addEventListener('message', $A.getCallback(function(event, message) {
                // @TODO Secure here!!
                helper.handlePageResponses(component, event.data);
            }), false);

            // Get the Record Address Fields
            var recordNameField = component.get('v.recordNameField');
            var recordDescriptionField = component.get('v.recordDescriptionField');
            var recordStreetField = component.get('v.recordStreetField');
            var recordSuburbField = component.get('v.recordSuburbField');
            var recordCityField = component.get('v.recordCityField');
            var recordRegionField = component.get('v.recordRegionField');
            var recordCountryField = component.get('v.recordCountryField');
            var recordZipField = component.get('v.recordZipField');
            var recordLogoIconField = component.get('v.recordLogoIconField');

            if (recordStreetField || recordSuburbField || recordCityField || recordCountryField || recordZipField) {

                // Add it to the list of field names
                var arrayOfFieldNames = ['Id'];
                if (recordNameField) arrayOfFieldNames.push(recordNameField);
                if (recordDescriptionField) arrayOfFieldNames.push(recordDescriptionField);
                if (recordStreetField) arrayOfFieldNames.push(recordStreetField);
                if (recordSuburbField) arrayOfFieldNames.push(recordSuburbField);
                if (recordCityField) arrayOfFieldNames.push(recordCityField);
                if (recordRegionField) arrayOfFieldNames.push(recordRegionField);
                if (recordCountryField) arrayOfFieldNames.push(recordCountryField);
                if (recordZipField) arrayOfFieldNames.push(recordZipField);
                if (recordLogoIconField) arrayOfFieldNames.push(recordLogoIconField);
                component.set('v.recordFieldNames', arrayOfFieldNames);

                helper.getRecord(component);

            } else {

                // Hide the map
                component.set('v.renderMap', false);

                // Clear the address
                component.set('v.recordAddress', null);

                // Show error
                helper.showError(component, 'No record address fields found!');

                helper.hideWaiting(component);

            }

        } else {

            // Get the VF URL
            var action = component.get("c.getVFGoogleMapPageURL");
            var errors, state;
            action.setCallback(this, function(response) {
                state = response.getState();
                if (state === 'SUCCESS' && component && component.isValid()) {
                    component.set('v.vfGoogleMapURL', response.getReturnValue());
                } else if (state === 'ERROR') {
                    errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            $A.log('Error message: ' + errors[0].message);
                        }
                    }
                }
            });
            $A.enqueueAction(action);
        }

    },

    handleRecordUpdated: function (component, event, helper) {
        helper.handleRecordUpdated(component, event);
    },

    showWaiting: function (component, event, helper) {
        helper.showWaiting(component);
    },

    hideWaiting: function (component, event, helper) {
        helper.hideWaiting(component);
    },

    sendToMap: function (component, event, helper) {
        helper.sendToMap(component);
    },

    addWaypointAddress: function (component, event, helper) {
        var waypointAddresses = component.get('v.waypointAddresses');
        waypointAddresses.push('');
        component.set('v.waypointAddresses', waypointAddresses);
    },

    waypointAddressChanged: function (component, event, helper) {
        var waypointAddresses = component.get('v.waypointAddresses');
        waypointAddresses[event.getSource().get('v.name')] = event.getSource().get('v.value');
        component.set('v.waypointAddresses', waypointAddresses);
    },

    waypointAddressesChanged: function (component, event, helper) {
        helper.handleRecordUpdated(component);
    },

    removeWaypointAddress: function (component, event, helper) {
        var index = event.getSource().get('v.value');
        var waypointAddresses = component.get('v.waypointAddresses');
        waypointAddresses.splice(index, 1);
        component.set('v.waypointAddresses', waypointAddresses);
    },

    displayAddressTooltip : function(component, event, helper) {
        helper.toggleHelper(component, 'tooltip-addAddress');
    },

    displayOutAddressTooltip : function(component, event, helper) {
        helper.toggleHelper(component, 'tooltip-addAddress');
    },

    displayRefreshTooltip : function(component, event, helper) {
        helper.toggleHelper(component, 'tooltip-refresh');
    },

    displayOutRefreshTooltip : function(component, event, helper) {
        helper.toggleHelper(component, 'tooltip-refresh');
    }

})