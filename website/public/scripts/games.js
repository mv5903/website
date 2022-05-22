function init() {
    let games = ['Connect Four', 'TicTacToe', 'Snake'];
    for (var i = 0; i < games.length; i++) {
        let fileName = games[i].toLowerCase().replace(' ', '');
        let str = '<div class="item"><a href="/games/' + fileName + '/' + fileName + '.html">' + games[i] + '</a></div>';
        console.log(str);
        $('.games').append(str);
    }
}