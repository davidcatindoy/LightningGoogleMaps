/**
* @author Tiaan Swart (tiaan@cloudinit.nz)
* @date 2018-09-18
* @description Google Maps Util Class
*
* CHANGE LOG
* 2018-09-18 - Initial setup
**/
public with sharing class GoogleMapUtil {

    /**
    *   @author Tiaan Swart (tiaan@cloudinit.nz)
    *   @description Get the URL for the VisualForce Page
    *   @return String URL
    **/
    @AuraEnabled
    public static String getVFGoogleMapPageURL() {
        PageReference vfPage = Page.GoogleMap;
        return Url.getSalesforceBaseUrl().toExternalForm()+vfPage.getUrl();
    }

}