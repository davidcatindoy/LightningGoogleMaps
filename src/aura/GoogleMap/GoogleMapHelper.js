/**
 * @author Tiaan Swart (tiaan@cloudinit.nz)
 * @date 2018-09-18
 * @description
 *
 * CHANGE LOG
 * 2018-09-18 - Initial setup
 **/
({
    showError: function (component, errorMessage) {

        if (errorMessage) {

            // Get the title
            var title = component.get('v.title');

            // Show error
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                'type': 'error',
                'title': title + ' Error',
                'message': errorMessage
            });
            toastEvent.fire();

        }

    },

    showWaiting: function (component) {
        component.set('v.isWaiting', true);
    },

    hideWaiting: function (component) {
        component.set('v.isWaiting', false);
    },

    getRecord : function(component) {

        this.showWaiting(component);

        // Get the Record Field Names
        var recordFieldNames = component.get('v.recordFieldNames');

        if (recordFieldNames && recordFieldNames.length > 1) {

            // Get the Record Id
            var recordId = component.get('v.recordId');

            if (recordId) {

                // Find the record cmp
                var recordLoader = component.find('recordLoader');

                // Reload the record
                recordLoader.reloadRecord();

            } else {

                // Hide the map
                component.set('v.renderMap', false);

                // Clear the address
                component.set('v.recordAddress', null);

                // Show error
                this.showError(component, 'No record Id found!');

                this.hideWaiting(component);
            }

        } else {

            // Hide the map
            component.set('v.renderMap', false);

            // Clear the address
            component.set('v.recordAddress', null);

            // Show error
            this.showError(component, 'No record address field found!');

            this.hideWaiting(component);

        }
    },

    handleRecordUpdated: function (component, event) {

        this.showWaiting(component);

        // Get the event that started this
        var eventParams = typeof event !== "undefined" ? event.getParams() : {changeType : "LOADED"};

        if (eventParams.changeType === "LOADED" || eventParams.changeType === "CHANGED") {

            // Get the Record Field Names
            var recordFieldNames = component.get('v.recordFieldNames');

            if (recordFieldNames && recordFieldNames.length > 1) {

                // Show the map
                component.set('v.renderMap', true);

                this.sendToMap(component);

            } else {

                // Hide the map
                component.set('v.renderMap', false);

                // Clear the address
                component.set('v.recordAddress', null);

                this.hideWaiting(component);
            }

        } else if (eventParams.changeType === "ERROR") {

            // Hide the map
            component.set('v.renderMap', false);

            // Clear the address
            component.set('v.recordAddress', null);

            // Get the Error
            var recordError = component.get('v.recordError');

            // Show error
            this.showError(component, recordError);

            this.hideWaiting(component);

        }

    },

    getMarkerData: function (component, draggable) {

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

        // Init marker data
        var markerData = {};

        // Get the Record Address Field Values
        if (recordNameField) markerData.title = component.get('v.simpleRecord.' + recordNameField);
        if (recordDescriptionField) markerData.description = component.get('v.simpleRecord.' + recordDescriptionField);
        if (recordStreetField) markerData.street = component.get('v.simpleRecord.' + recordStreetField);
        if (recordSuburbField) markerData.suburb = component.get('v.simpleRecord.' + recordSuburbField);
        if (recordCityField) markerData.city = component.get('v.simpleRecord.' + recordCityField);
        if (recordRegionField) markerData.region = component.get('v.simpleRecord.' + recordRegionField);
        if (recordCountryField) markerData.country = component.get('v.simpleRecord.' + recordCountryField);
        if (recordZipField) markerData.zip = component.get('v.simpleRecord.' + recordZipField);
        markerData.draggable = draggable ? true : false;
        if (recordLogoIconField) markerData.logo = component.get('v.simpleRecord.' + recordLogoIconField);

        // Add marker data as array
        var returnMarkerData = [];
        returnMarkerData.push(markerData);

        // Get waypoints
        var waypointAddresses = component.get('v.waypointAddresses');
        if (waypointAddresses && waypointAddresses.length) {
            waypointAddresses.forEach(function (waypointAddress, index) {
                if (waypointAddress && waypointAddress.trim().length) {
                    returnMarkerData.push({'street': waypointAddress});
                }
            });
        }

        return returnMarkerData;

    },

    sendToMap: function (component) {

        this.showWaiting(component);

        // Are we done rendering yet?
        if (component.get('v.isDoneRendering') && component.get('v.renderMap')) {

            // Find the Map Frame
            var gmFrame = component.find('googleMapIframe');
            var gmFrameElement = gmFrame.getElement();

            if (gmFrameElement) {

                var gmFrameContentWindow = gmFrameElement.contentWindow;

                // Configure Map Settings & Data
                var gmConfig = {
                    parentHostName                  : window.location.href,
                    renderMap                       : component.get('v.renderMap'),
                    markerData                      : this.getMarkerData(component),
                    mapZoom                         : component.get('v.mapZoom'),
                    mapZoomControl                  : component.get('v.mapZoomControl'),
                    mapBoundsControl                : component.get('v.mapBoundsControl'),
                    mapMapTypeControl               : component.get('v.mapMapTypeControl'),
                    mapMapTypeIds                   : component.get('v.mapMapTypeIds').split(','),
                    mapScaleControl                 : component.get('v.mapScaleControl'),
                    mapStreetViewControl            : component.get('v.mapStreetViewControl'),
                    mapRotateControl                : component.get('v.mapRotateControl'),
                    mapFullscreenControl            : component.get('v.mapFullscreenControl'),
                    autoCloseLastOpenedInfoWindow   : component.get('v.autoCloseLastOpenedInfoWindow'),
                    calculateAndDisplayRouteEnabled : component.get('v.calculateAndDisplayRouteEnabled'),
                    routeTravelMode                 : component.get('v.routeTravelMode')
                };

                // Send Map Settings & Data to VF
                gmFrameContentWindow.postMessage(gmConfig, component.get('v.vfGoogleMapURL'));
            }

        }

    },

    handlePageResponses: function (component, response) {
        if (response.changeType === "LOADED" || response.changeType === "CHANGED") {
            this.hideWaiting(component);
            // If we have marker data to update
            if (response.markerData && response.markerData.length > 1) {
                // Get the waypoints
                var waypointAddresses = component.get('v.waypointAddresses');
                // Remove first item
                response.markerData.shift();
                // Now for each waypoint
                response.markerData.forEach(function(marker, index){
                    // Update it
                    waypointAddresses[index] = marker.formatted_address;
                });
            }
        }
    },

    toggleHelper : function(component, element) {
        $A.util.toggleClass(component.find(element), 'slds-hidden');
    }
})