/**
* @author Tiaan Swart (tiaan@cloudinit.nz)
* @date 2018-09-18
* @description Test Class for GoogleMapUtil
*
* CHANGE LOG
* 2018-09-18 - Initial setup
**/
@IsTest
private class GoogleMapUtilTest {

    @IsTest
    static void testGoogleMapUtil() {
        System.assertNotEquals(null, GoogleMapUtil.getVFGoogleMapPageURL());
    }

}