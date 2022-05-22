const database = '6b5c8f93ad1c4502bc77b1d349dedf69';
const NOTION_API_KEY = 'secret_MQaGy2viw6DyBeRcD2ZX4P0zrHKDXBhA38aQoVMuJW6';

window.onload = () => {
    submit();
}

let submit = async () => {
    let response = await fetch('https://api.notion.com/v1/databases/' + database, {
        mode: 'no-cors',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer \'"' + NOTION_API_KEY + '"\'',
            'Notion-Version': '2021-08-16'
        }
    });
    let data = await response.json();
    console.log(data);
}