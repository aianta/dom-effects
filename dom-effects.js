export default (function(){

    console.log("dom-effects ran!")

    const nodeFields = [
        "async",
        "baseURI",
        "childElementCount",
        "className",
        "clientHeight",
        "clientLeft",
        "clientTop",
        "clientWidth",
        "id",
        "nodeName",
        "localName",
        "outerHTML",
        "innerHTML",
        "title",
        "type",
        "text"
    ]

    // Generating XPath
    // https://stackoverflow.com/questions/3454526/how-to-calculate-the-xpath-position-of-an-element-using-javascript
    const getElementTreeXPath = function(element)
        {
            var paths = [];  // Use nodeName (instead of localName) 
            // so namespace prefix is included (if any).
            for (; element && element.nodeType == Node.ELEMENT_NODE; 
                element = element.parentNode)
            {
                var index = 0;
                var hasFollowingSiblings = false;
                for (var sibling = element.previousSibling; sibling; 
                    sibling = sibling.previousSibling)
                {
                    // Ignore document type declaration.
                    if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE)
                        continue;

                    if (sibling.nodeName == element.nodeName)
                        ++index;
                }

                for (var sibling = element.nextSibling; 
                    sibling && !hasFollowingSiblings;
                    sibling = sibling.nextSibling)
                {
                    if (sibling.nodeName == element.nodeName)
                        hasFollowingSiblings = true;
                }

                var tagName = (element.prefix ? element.prefix + ":" : "") 
                                + element.localName;
                var pathIndex = (index || hasFollowingSiblings ? "[" 
                        + (index + 1) + "]" : "");
                paths.splice(0, 0, tagName + pathIndex);
            }

            return paths.length ? "/" + paths.join("/") : null;
        };

    // Helper function that strips data from fields listed in nodeFields and returns them in an object
    const stripDataFromNode = function(node){
        const data = {}

        //Also report XPATH
        data.xpath = getElementTreeXPath(node)
        if (data.xpath === null){
            return data // Don't bother doing any extra work for null xpath nodes
        }

        for (const property in node){
            if (nodeFields.includes(property)){
                data[property] = node[property]
            }
        }

        return data
    }

    // Helper function that strips data from list of nodes and returns stripped data in a list.
    const stripDataFromNodes = function(nodes){
        const data = []
        nodes.forEach((node)=>{
            // Don't bother getting data for elements with null xpath
            const nodeData = stripDataFromNode(node)
            if (nodeData.xpath !== null){
                data.push(stripDataFromNode(node))
            }

        })
        return data
    }

    // window.addEventListener('load', (event)=>{
    //     window.LogUI.stop()
    // })

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
        const eventDetails = {
            name:'DOM_EFFECT'
        }

        for (const mutation of mutationList){
            console.log(`A mutation of type ${mutation.type} has been observed`)
            console.log(mutation)
            if (mutation.type === "childList"){

                //If a node was added
                if(mutation.addedNodes.length > 0){
                    eventDetails.action = 'add'
                    eventDetails.nodes = stripDataFromNodes(mutation.addedNodes)
                }

                //If a node was removed
                if(mutation.removedNodes.length > 0){
                    eventDetails.action = 'remove'
                    eventDetails.nodes = stripDataFromNodes(mutation.removedNodes)
                }

                //Ensure LogUI is defined and active. Only log event if we have nodes to report
                if(window.LogUI && window.LogUI.isActive() && eventDetails.nodes.length > 0){
                    console.log("passing eventDetails")
                    console.log(eventDetails)
                    window.LogUI.logCustomMessage(eventDetails)
                }
                
            }

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