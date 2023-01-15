class Location {
    constructor(name) {
        this.name = name;
        this.customers = [];
    }

    addCustomer(firstName, lastName){
        this.customers.push(new Customer(firstName, lastName));
    }
}

class Customer {
    constructor(firstName, lastName) {
        this.FirstName = firstName;
        this.lastName = lastName;
    }
}

class Business {
    static url = 'https://63c2216ab0c286fbe5e9e900.mockapi.io/Locations';

    static getAllLocations() {
        return $.get(this.url);
    }

    static getLocation(id) {
        return $.get(this.url + `/${id}`);
    }

    static createLocation(location) {
        return $.post(this.url, location);
    }

    static updateLocation(location) {
        return $.ajax({
            url: this.url + `/${location._id}`,
            dataType: 'json',
            data: JSON.stringify(location),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteLocation(location) {
        return $.ajax({
            url: this.url + `/${location._id}`,
            dataType: 'json',
            data: JSON.stringify(location),
            contentType: 'application/json',
            type: 'DELETE'
        });
    }
}


class DOMManager {
    static locations;

    static getAllLocations() {
       Business.getAllLocations().then(locations => this.render(locations));
    }

    static createLocation(name) {
        Business.createLocation(new Location(name))
            .then(() => {
                return Business.getAllLocations();
            })
            .then((locations) => this.render(locations));
    }





    static render(locations) {
        this.locations = locations;
        $('#app').empty();
        for (let location of locations) {
            $('#app').prepend(
                `<div id="${location._id}" class="card">
                        <div class="card-header">
                            <h2>${location.name}</h2>
                            <button class="btn btn-outline-danger" onclick="DOMManager.deleteLocation('${location._id}')">Delete Location</button>
                        </div>
                        <div class="card-body">
                            <div class="card">
                                <div class="row">
                                    <div class="col-sm-5">
                                        <input type="text" id="${location._id}-customer-firstName" class="form-control" placeholder="Customer's First Name">
                                    </div>
                                    <div class="col-sm-5">
                                        <input type="text" id="${location._id}-customer-lastName" class="form-control" placeholder="Customer's Last Name">
                                    </div>
                                    <div class="col-sm-2">
                                        <button id="${location._id}-new-customer" onclick="DOMManager.addCustomer('${location._id}')" class="btn btn-outline-primary btn-sm form-control">Add</button>
                                    </div>
                                    </div>
                            </div>
                        </div>
                </div><br>`
            );
        

            
            for (let customer of location.customers) {
                $(`#${location._id}`).find('.card-body').append(
                    `<p>
                        <span id="name-${customer._id}"><strong>firstName: </strong> ${customer.firstName}</span>
                        <span id="name-${customer._id}"><strong>lastName: </strong> ${customer.lastName}</span>
                        <button class="btn btn-outline-danger" onclick="deleteCustomer('${location._id}', '${customer._id}')">Delete Customer</button>`
                );
            }
        }
    }   

   

   
    
    static addCustomer(id) {
        for (let location of this.locations) {
            if (location._id == id) {
                location.customers.push(new Customer($(`#${location._id}-customer-firstName`).val(), $(`#${location._id}-customer-lastName`).val()));
                Business.updateLocation(location)
                    .then(() => {
                        return Business.getAllLocations();
                    })
                    .then((_location) => this.render(locations));
            }
        }
    }

    static deleteCustomer(locationId, customerId) {
        for (let location of this.locations) {
            if (location._id == locationId) {
                for (let customer of location.customers) {
                    if (customer._id == customerId) {
                        location.customers.splice(location.customers.indexOf(customers), 1);
                        Business.updateLocation(location)
                            .then(() => {
                                return Business.getAllLocations();
                            })
                            .then((locations) => this.render(locations));
                    }
                }
            }
        }
    }

}

$(document).on('click', '#create-new-location', (() => {
    DOMManager.createLocation($('#new-location-name').val());
    $('#new-location-name').val('');
}))



DOMManager.getAllLocations();