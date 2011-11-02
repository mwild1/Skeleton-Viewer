
var terminal_commands = (function () {

var padNumber = function (x, digits)
{
	var strX = x.toString();
	return new Array(Math.max(1+digits - strX.length, 0)).join("0") + strX;
}

var escapeHtml = function (html)
{
	if(!html)
		return html;
	return html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
	           .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

return {
	help: function (command)
	{
		return "You are beyond help.";
	},
	ls: function (command, term)
	{
    		// be careful with the limit, some people have large datasets ;)
    		$.getJSON(baseUrl + '/Me/links/', {'limit':parseInt(command.flags.limit)||30}, function(data) {
			if(!data || !data.length) return;
			for(var i in data)
			{
				(function () {
					var item = data[i];
					var date = new Date(item.at);
					var date_string = date.getFullYear()+"-"+padNumber(date.getMonth(),2)+"-"+padNumber(date.getDate(),2);
					var a = "<a href='"+escapeHtml(item.link)+"'>"+escapeHtml(item.title||item.link)+"</a>";
					$.getJSON(baseUrl + '/Me/links/encounters/'+item._id, { limit: 1 }, function (encounters) {
						var encounter = encounters[0];
						var output = [escapeHtml(encounter.network), date_string, a].join(" ");
						term.write(output);
					});
				})();
			}
		});
	},
	grep: function (command, term)
	{
		var query = command.args[0];
    		$.getJSON(baseUrl + '/Me/links/search', {'limit':30, 'q': query}, function(data) {
    			for(var i in data)
    				term.write("<a href='"+data[i].link+"'>"+data[i].title+"</a>");
		});
	}
}; })();
