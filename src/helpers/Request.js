const Request = function(url = window.location.href)
{
    var self = this;
    self.url = JSON.parse(JSON.stringify(url));

    /**
     * here we return all the query strings and
     * their respective values in an object from
     * window.location.search
     * @return object
     */
    self.getComponents = () => {
        // get query strings
        let queryString = self.url.split('?');
        queryString = queryString[1] ? queryString[1] : '';

        // create empty components
        var components = {};

        // remove ? sign from query string 
        queryString = queryString.replace('?', '');

        // return null if query string is empty
        if(queryString.length > 0) {
            // split query at & signs and convert to array
            queryString = queryString.split("&");
        
            // loop through url query
            for(var i = 0; i < queryString.length; i++){
                let equlFirstPosition = queryString[i].indexOf('=');
                let comp = [
                    queryString[i].substr(0, equlFirstPosition),
                    queryString[i].substr((equlFirstPosition + 1), queryString[i].length - (equlFirstPosition + 1)),
                ];
                if(comp.length > 0 && comp[0].length > 0){
                    components[comp[0]] = typeof comp[1] != 'undefined'
                                        ? decodeURIComponent(comp[1]) : null;
                }
            }
        }
        
        // return found components
        return components;
    }

    /**
     * the get methog returs the value of a specific
     * query parameter
     * @param {string} name 
     * @param {any} defaultVal 
     * @return object
     */
    self.get = (name, defaultVal = null) => {
        // get components
        let components = self.getComponents();

        // set value
        let value = typeof components[name] != 'undefined' ? components[name] : defaultVal ;

        // return value
        return value;
    }

    /**
     * this returns only the specified query parameters
     * in an object
     * @param {array} names 
     * @return object
     */
    self.only = (names) => {
        // get components
        let components = self.getComponents();

        // set value
        var value = {};

        // iterate through names
        for(var i = 0; i < names.length; i++){
            value[names[i]] = typeof components[names[i]] != 'undefined' ? components[names[i]] : null ;
        }

        // return value
        return value;
    }

    /**
     * this returns all query params except the
     * specified parameters in an object
     * @param {array} names 
     * @return object
     */
    self.except = (names) => {
        // get components
        let components = self.getComponents();

        // set value
        var value = {};

        // iterate through names
        for(var i in components){
        if(names.indexOf(i) !== -1) continue;
        value[i] = components[i];
        }

        // return value
        return value;
    }

    /**
     * this returns all query params in an object 
     * @return object
     */
    self.all = () => {
        // get components
        let components = self.getComponents();

        // return value
        return components;
    }
}

export default Request