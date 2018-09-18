/**
 * @author Tiaan Swart (tiaan@cloudinit.nz)
 * @date 2018-04-14
 * @description
 *
 * CHANGE LOG
 * 2018-08-19 - Initial setup
 **/
({
    afterRender : function(component, helper){
        this.superAfterRender();

        // Find the Map Frame
        var gmFrame = component.find('googleMapIframe');

        if (gmFrame) {
            var gmFrameElement = gmFrame.getElement();

            if (gmFrameElement) {
                component.set('v.isDoneRendering', true);
            }
        }
    }
})