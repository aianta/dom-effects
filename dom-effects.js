export default (function(){

    console.log("dom-effects ran!")

    window.addEventListener('load', (event)=>{
        window.LogUI.stop()
    })

    /* Following the documentation from: 
     * https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
     */


    
    const observerOptions = {
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true
    }

    const callback = (mutationList, observer) => {
        for (const mutation of mutationList){
            console.log(`A mutation of type ${mutation.type} has been observed`)
            console.log(mutation)
        }
    }

    const observer = new MutationObserver(callback);

    /* Getting the root element on the page
     * https://developer.mozilla.org/en-US/docs/Web/API/Document/documentElement
     */
    observer.observe(document.documentElement, observerOptions)

    window.setTimeout(function(){
        observer.disconnect()
    }, 60000)
})(window)