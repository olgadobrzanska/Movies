if(!port)
    var port = 4000;
let host = "https://olgamoviesapi.herokuapp.com";
var app2 = new Vue({
    el: '#buttons',
    data: {
        actors: null,
        movies: null,
        name: null,
        title: null,
        role: null,
        searchActors: null,
        searchMovies: null,
        selectedActor: null,
        selectedMovie: null,
        selectedActorButton: null,
        selectedMovieButton: null,

    },
    mounted() {
        this.refreshMovies();
        this.refreshActors();
    },
    computed: {
        displayedActors: function () {
            let text = this.searchActors;
            if (text)
                return this.actors.filter(function (a) {
                    return a.name.toLowerCase().indexOf(text.toLowerCase()) !== -1;
                })
            return this.actors;
        },
        displayedMovies: function () {
            let text = this.searchMovies;
            if (text)
                return this.movies.filter(function (m) {
                    return m.title.toLowerCase().indexOf(text.toLowerCase()) !== -1;
                })
            return this.movies;
        }
    },
    methods: {
        showMovies: function (event) {
            if (this.selectedActor)
                axios.get(`${host}/movies/${this.selectedActor}`)
                    .then(response => {
                        this.movies = response.data.map(movie => { return { "title": movie._fields[0], "tagline": movie._fields[1], "released": (movie._fields[2]) ? movie._fields[2].low : 'Unknown' } });
                    }).catch(error => {
                        console.log(error);
                    })
        },
        showActors: function (event) {
            if (this.selectedMovie)
                axios.get(`${host}/actors/${this.selectedMovie}`)
                    .then(response => {
                        this.actors = response.data.map(actor => { return { "name": actor._fields[0], "born": (actor._fields[1]) ? actor._fields[1].low : 'Unknown' } });
                    }).catch(error => {
                        console.log(error);
                    })
        },
        selectActor: function (event) {
            if (this.selectedActorButton)
                this.selectedActorButton.classList.remove("selected");

            this.selectedActorButton = event.currentTarget;

            this.selectedActor = this.selectedActorButton.getAttribute("tag");
            this.selectedActorButton.classList.add("selected");
        },
        selectMovie: function (event) {
            if (this.selectedMovieButton)
                this.selectedMovieButton.classList.remove("selected");

            this.selectedMovieButton = event.currentTarget;

            this.selectedMovie = this.selectedMovieButton.getAttribute("tag");
            this.selectedMovieButton.classList.add("selected");
        },
        refreshMovies: function (event) {

            axios.get(`${host}/movies`)
                .then(response => {
                    this.movies = response.data.map(movie => { return { "title": movie._fields[0], "tagline": movie._fields[1], "released": (movie._fields[2]) ? movie._fields[2].low : 'Unknown' } });
                }).catch(error => {
                    console.log(error);
                })
        },
        refreshActors: function (event) {

            //`CREATE (p:Person {name:"${request.query.person}", born:"${request.query.born}"})`
            axios.get(`${host}/actors`)
                .then(response => {
                    this.actors = response.data.map(actor => { return { "name": actor._fields[0], "born": (actor._fields[1]) ? actor._fields[1].low : 'Unknown' } });
                    $('[data-toggle="popover"]').popover();
                }).catch(error => {
                    console.log(error);
                });
        },
        link: function (event) {

            //`MATCH (p:Person {name: "${request.query.person}"}) 
            //MATCH (m:Movie {title: "${request.query.movie}"}) 
            // CREATE (p)-[:ACTED_IN {roles:['${request.query.role}']}]->(m)`, {}
            if (this.selectedActor && this.selectMovie)
                axios.put(`${host}/relationship?person=${this.selectedActor}&movie=${this.selectedMovie}&role=${this.role}`)
                    .then(response => {
                        console.log(response);
                        alert(response.statusText);
                    }).catch(error => {
                        console.log(error);
                    })
            else
                alert('Actor and movie must be selected first!');

        }
    }
})

var app2 = new Vue({
    el: '#forms',
    data: {
        name: null,
        born: 1990,
        title: null,
        tagline: null,
        released: 2000
    },
    methods: {
        addActor: function (event) {
            if (this.name)
                //`CREATE (p:Person {name:"${request.query.person}", born:"${request.query.born}"})`
                axios.put(`${host}/actor?person=${this.name}&born=${this.born}`)
                    .then(response => {
                        console.log(response);
                        alert(response.statusText);
                    }).catch(error => {
                        console.log(error);
                    })
            else
                alert('Actor name must be set!');
        },
        addMovie: function (event) {
            if (this.title)
                //`CREATE (m:Movie {title:'${request.query.title}', released:${request.query.released}, tagline:'${request.query.tag}'})`
                axios.put(`${host}/movie?title=${this.title}&released=${this.released}&tag=${this.tagline}`)
                    .then(response => {
                        console.log(response);
                        alert(response.statusText);
                    }).catch(error => {
                        console.log(error);
                    })
            else
                alert('Movie title must be set!');
        }
    }
})
