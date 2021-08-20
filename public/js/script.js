onload(getPlanets());

function showFileName() {
    const filename = document.getElementById('file').files;
    document.getElementById('file_button').innerHTML = filename[0].name;
}
function addPlanets() {
    const form = document.querySelector('#add');
    let data = new FormData();
    for (let i = 1; i < form.length - 1; i++) {
        data.append(form[i].name, form[i].value);
    }
    data.append('foto', form[0].files[0]);

    const url = 'http://localhost:3000/planetas';

    fetch(url, {
        method: 'POST',
        body: data,
    })
        .then((res) => {
            res.json()
                .then((data) => {
                    if (res.status != 201) {
                        document.getElementById('alert').innerHTML = data.response.message;
                    } else {
                        document.getElementById('alert').innerHTML = data.response.message;
                        getPlanets();
                    }
                })
                .catch((error) => {});
        })
        .catch((error) => {});
}

function getUpdatePlanets(planet = {}) {
    document.querySelector('#id').value = planet.id;
    document.querySelector('#nome').value = planet.nome;
    document.querySelector('#distancia_sol').value = planet.distancia_sol;
    document.querySelector('#translacao').value = planet.translacao;
    document.querySelector('#diametro_equatorial').value = planet.diametro_equatorial;
    document.querySelector('#rotacao').value = planet.rotacao;
    document.querySelector('#temperatura_superficie').value = planet.temperatura_superficie;
    document.querySelector('#densidade_media').value = planet.densidade_media;
    document.querySelector('#num_satelites_naturais').value = planet.num_satelites_naturais;
    scrollTo(0, 0);
}

function updatePlanets() {
    let form = document.querySelector('#add');

    let id = document.querySelector('#id').value;

    let data = new FormData();
    for (let i = 1; i < form.length - 3; i++) {
        data.append(form[i].name, form[i].value);
    }

    data.append('foto', form[0].files[0]);

    const url = `http://localhost:3000/planetas/${id}`;

    fetch(url, {
        method: 'PATCH',
        body: data,
    })
        .then((res) => {
            res.json()
                .then((data) => {
                    if (res.status != 201) {
                        document.getElementById('alert').innerHTML = data.response.message;
                    } else {
                        document.getElementById('alert').innerHTML = data.response.message;
                        getPlanets();
                    }
                })
                .catch((error) => {});
        })
        .catch((error) => {});
}
function getPlanets() {
    const url = 'http://localhost:3000/planetas';

    fetch(url)
        .then((res) => {
            res.json()
                .then((data) => {
                    if (res.status == 200) {
                        listPlanets(data.response);
                    }
                })
                .catch((error) => {});
        })
        .catch((error) => {});
}
function listPlanets(data = {}) {
    document.querySelector('#box').innerHTML = '';
    let plan = data.planets;
    for (let i = 0; i < plan.length; i++) {
        let box = document.querySelector('#box');
        let planets = document.createElement('div');
        planets.classList.add('planets');
        box.appendChild(planets);
        let planet = document.createElement('div');
        planets.classList.add('planet');
        planets.appendChild(planet);
        let img = document.createElement('img');
        img.src = plan[i].url;
        img.alt = plan[i].nome;
        planet.appendChild(img);
        let edit = document.createElement('button');
        edit.classList.add('edit');
        edit.addEventListener('click', () => {
            getUpdatePlanets(plan[i]);
        });
        edit.innerHTML = 'Editar';
        let del = document.createElement('button');
        del.classList.add('delete');
        del.addEventListener('click', () => {
            deletePlanets(plan[i].id);
        });
        del.innerHTML = 'Deletar';
        let data = document.createElement('div');
        data.classList.add('data');
        planets.appendChild(data);
        data.innerHTML = `
                    Nome: ${plan[i].nome} <br /><br />
                    Distância do Sol: ${plan[i].distancia_sol} <br /><br />
                    Translção: ${plan[i].translacao} <br /><br />
                    Rotação: ${plan[i].rotacao} <br /><br />
                    Diametro Equatorial: ${plan[i].diametro_equatorial} <br /><br />
                    Temperatura: ${plan[i].temperatura_superficie} <br /><br />
                    Densidade Média: ${plan[i].densidade_media} <br /><br />
                    Luas: ${plan[i].num_satelites_naturais} <br /><br />             
                    `;
        box.appendChild(edit);
        box.appendChild(del);
    }
}
function deletePlanets(planetId) {
    scrollTo(0, 0);
    const url = `http://localhost:3000/planetas/${planetId}`;

    fetch(url, {
        method: 'DELETE',
    })
        .then((res) => {
            res.json()
                .then((data) => {
                    if (res.status != 200) {
                        document.getElementById('alert').innerHTML = data.response.message;
                    } else {
                        document.getElementById('alert').innerHTML = data.response.message;
                        getPlanets();
                    }
                })
                .catch((error) => {});
        })
        .catch((error) => {});
}
