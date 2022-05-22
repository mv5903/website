window.onload = () => {
    if (!isMatt()) logUser();
}

let isMatt = () => {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var c = url.searchParams.get("isMatt");
    return c ? true : false;
}

let logUser = async () => {
    const response = await fetch('https://ipwhois.app/json/');
    const data = await response.json();
    if (data.city === '') {
        return;
    }
    let logged = new Map();
    logged.set('ip', data.ip);
    logged.set('continent', data.continent);
    logged.set('country', data.country);
    logged.set('region', data.region);
    logged.set('city', data.city);
    logged.set('isp', data.isp);
    logged.set('timestamp', getTimestamp() + ' PT')
    logged.forEach((key, value) => {
        setCookie(value, key);
    })
    saveToDB();
}

let saveToDB = () => {
    let req = new XMLHttpRequest();
    req.open("POST", "/database/logData.php", true);
    req.send();
    console.log(req);
}

let getTimestamp = () => {
    let date = new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"});
    return date.toString();
}

let setCookie = (cname, cvalue) => {
    document.cookie = `${cname}=${cvalue}; path=/`;
}