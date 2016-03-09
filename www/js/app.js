var token = '';

window.onload = function () {
    console.log("this is so cool....!")

    var UI = new UbuntuUI();

    UI.init();
    UI.pagestack.push('main');
    var api = external.getUnityObject('1.0');
    var oa = api.OnlineAccounts;

    // UI.button('getstatus').click(auth);

    auth();

    function auth() {
        console.log("getstatus button is clicked!");

        var filters = {'provider': 'html5-weibo.ubuntu_account-plugin', 'service': ''};

        oa.api.getAccounts(filters, function(accounts) {
            console.log("total length: " + accounts.length);

            if (accounts.length < 1) {
                // setResults('No accounts available');
                oa.api.requestAccount(
                    "html5-weibo.ubuntu_html5weibo",
                    unescape("html5-weibo.ubuntu_account-plugin"),

                    function() {
                        console.log("requestAccount callback...");
                        auth();
                });
                return;
            } else {
                // setResults("Available accounts: " + accounts.length);
            }

            function authcallback(res) {
                token = res['data']['AccessToken'];
                console.log("AccessToken: " + token);
//                setResults("AccessToken: " + token);

                getWeiboStatus(token, function(statuses) {
                    console.log("the length: " + statuses.length);

                    if (statuses) {
                        // create the 'ul' element
                        var ul = document.createElement('ul');
//                        var results = document.getElementById('results');
                        var results = document.querySelector('#results');
                        var statuslist = document.querySelector('#statuslist');
                        var ul = document.createElement('ul');

                        for (var i = 0; i < statuses.length; i ++) {

                            var li = document.createElement('li');
                            ul.appendChild(li);

                            var aside = document.createElement('aside');
                            li.appendChild(aside);

                            var img = document.createElement('img');
                            img.setAttribute('src', statuses[i]['profile_image_url']);
                            img.setAttribute('width', "50");
                            img.setAttribute('height', "50");
                            aside.appendChild(img);

                            var a = document.createElement('a');
                            a.setAttribute('href', '#');
                            a.innerHTML = statuses[i]['text'];
                            li.appendChild(a);

                            var right = document.createElement('label');
                            right.innerHTML = ""
                            li.appendChild(right);

                        }

                        console.log("it is done6");
                        statuslist.appendChild(ul);
                    }
                    else {
                        setResults('<br><br>ERROR');
                    }
                });
            }

            accounts[0].authenticate(authcallback);
        }); //getAccounts
    } //auth

    function getWeiboStatus(accessToken, callback) {
        var http = new XMLHttpRequest()
        var url = "https://api.weibo.com/2/statuses/home_timeline.json?access_token=" + accessToken + "&page=" + 1

        console.log('url: \n' + url)

        http.open("GET", url, true);
        var statuses = [];
        http.onreadystatechange = function() {
            if (http.readyState === 4){
                if (http.status == 200) {
                    var response = JSON.parse(http.responseText);
                    console.log("it succeeds! lenght: " );

                    for (i = 0; i < response['statuses'].length; i++ ) {
                        var time = JSON.stringify(response['statuses'][i]['created_at']);
//                        console.log("time: " + time );

                        var text = JSON.stringify(response['statuses'][i]['text']);
//                        console.log("text: " + text);

                        var name = JSON.stringify(response['statuses'][i]['user']['name']);
//                        console.log("name: " + name);

                        var profile_image_url = JSON.stringify(response['statuses'][i]['user']['profile_image_url']);
                        profile_image_url = profile_image_url.slice(1, profile_image_url.length-1);
//                      console.log("profile_image_url: " + profile_image_url);

                        var id = JSON.stringify(response['statuses'][i]['idstr']);

                        statuses.push({'time': time,
                                       'text': text,
                                       'name': name,
                                       'id': id,
                                       'profile_image_url': profile_image_url});
                    }

                    callback(statuses);

                } else {
                    console.log("error: " + http.status)
                    callback(null);
                }
            }
        };
        http.send(null);
    }

    function setResults(data) {
        var results = document.getElementById('results');
        results.innerHTML = data;
    };

}; //onload
