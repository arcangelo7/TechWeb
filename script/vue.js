Vue.component("mappa", {
    template: `
        <div id="mappa"></div>
    `
});

Vue.component("new-clip-form", {
    template: `
    <div id="new-clip-form-modal" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Nuova clip</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="nuovaClip">
                        <div class="form-group row">
                            <label for="titolo" class="col-sm-2 col-form-label">Titolo</label>
                            <div class="col-sm-10">
                                <input type="texts" class="form-control" id="titolo" placeholder="Piazza Maggiore">
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="testo" class="col-sm-2 col-form-label">Testo</label>
                            <div class="col-sm-10">
                                <textarea class="form-control" id="testo" rows="3"></textarea>
                            </div>
                        </div>
                        <div class="row">
                            <label for="check-scopo" class="col-sm-2 col-form-label">Scopo</label>
                            <div id="check-scopo" class="col-sm-10">
                                <div class="form-check form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="scopo" id="what" value="what" checked>
                                    <label class="form-check-label" for="what">
                                        What
                                    </label>
                                </div>
                                <div class="form-check form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="scopo" id="how" value="how">
                                    <label class="form-check-label" for="how">
                                        How
                                    </label>
                                </div>
                                <div class="form-check form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="scopo" id="why" value="why">
                                    <label class="form-check-label" for="why">
                                        Why
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="categoria" class="col-sm-2 col-form-label">Categoria</label>
                            <div class="col-sm-10">
                                <select class="form-control" id="categoria">
                                    <option>Nessuna</option>
                                    <option>Natura</option>
                                    <option>Arte</option>
                                    <option>Storia</option>
                                    <option>Folklore</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="pubblico" class="col-sm-2 col-form-label">Pubblico</label>
                            <div class="col-sm-10">
                                <select class="form-control" id="pubblico">
                                    <option>Pubblico generico</option>
                                    <option>Pre-scuola</option>
                                    <option>Scuola primaria</option>
                                    <option>Scuola media</option>
                                    <option>Specialisti del settore</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary">Save changes</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>    
    `
});

var app = new Vue({
    el: "#app"
});
