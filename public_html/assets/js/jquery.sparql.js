(function ($) {

    $.fn.query = function (query, options) {
        if (options) {
            var opts = $.extend({}, $.fn.defaults, options);
            $.fn.defaults = opts;
        }
        query = this.prefixesAsString() + query;
        var json_string = $.ajax(
                {
                    url: $.fn.defaults.source + "query",
                    data: {"query": query, "output": "json"},
                    type: "GET",
                    async: false,
                    dataType: 'json'
                }
        ).responseText;
        if (json_string.indexOf('Error') == -1) {
            var json = $.parseJSON(json_string);
            return json.results.bindings;
        }
        //ERROR

        return {"error": true, "response": json_string}; //evenutally parse code and other data

    }

    $.fn.verbsForObject = function (object) {
        var results = $(this).query('SELECT distinct ?v where {' + object + ' ?v ?o.}');
        var verbs = new Array();

        for (i = 0; i < results.length; i++) {
            verbs.push(results[i].v);
        }
        return verbs;
    }

    $.fn.resolvePrefix = function (str) {
        for (i = 0; i < $.fn.defaults.prefixes.length; i++) {
            var prefix = $.fn.defaults.prefixes[i];
            if (str.indexOf(prefix.value) == 0) {
                return prefix.prefix + str.substr(prefix.value.length);
            }
        }
        return str;
    }

    $.fn.prefixesAsString = function () {
        var str = "";
        $.each($.fn.defaults.prefixes, function (key, value) {
            str += "prefix " + key + " <" + value + "> ";
        });
        return str;
    }

//	$.fn.query.prefixString = function() {

//	}

    // Plugin defaults
    $.fn.defaults = {
        "source": "http://fuseki.georgepacheco.tk/smartUFBA/", //Defualt source to use out of the sources
        "prefix": "prefix dul: <http://www.loa-cnr.it/ontologies/DUL.owl#> prefix iot-lite: <http://purl.oclc.org/NET/UNIS/fiware/iot-lite#> prefix geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> prefix ssn: <http://purl.oclc.org/NET/ssnx/ssn#> prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix m3: <http://purl.org/iot/vocab/m3-lite#>",
        "prefixes": {
            'rdf:': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
            'm3:': 'http://purl.org/iot/vocab/m3-lite#',
            'ssn:': 'http://purl.oclc.org/NET/ssnx/ssn#',
            'geo:': 'http://www.w3.org/2003/01/geo/wgs84_pos#',
            'iot-lite:': 'http://purl.oclc.org/NET/UNIS/fiware/iot-lite#',
            'dul:': 'http://www.loa-cnr.it/ontologies/DUL.owl#'
        }
    };


}(jQuery));
