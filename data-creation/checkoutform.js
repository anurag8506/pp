const fs = require('fs');
const path = require('path');
const formidable = require("formidable");
const validator = require("./validator.js");
const axios = require('axios');
module.exports = {
    getexpectedDelivery: async (pincode) => {
        var data = JSON.stringify({
            "email": "amit.code.404@gmail.com",
            "password": "qwerty@PP@2024"
        });

        var config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://apiv2.shiprocket.in/v1/external/auth/login',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        var retrunData = await axios(config)
            .then(function (response) {
                return ({ status: true, data: response.data });
            })
            .catch(function (error) {
                console.log(error);
                return ({ status: false, data: {} });
            });

        var config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://apiv2.shiprocket.in/v1/external/courier/serviceability/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + retrunData.data.token
            },
            data: JSON.stringify({
                "pickup_postcode": 110032,
                "delivery_postcode": pincode,
                "cod": 1,
                "weight": "1",
            })
        };

        var retrunData = axios(config)
            .then(function (response) {
                var SurfaceexpectedDelivery = 99;
                var AirexpectedDelivery = 99;
                var AirexpectedRate = 99;
                var SurfaceexpectedRate = 99;
                var SurfaceDeliveryPartner = '';
                var AirDeliveryPartner = '';
                for (var i = 0; i < response.data.data.available_courier_companies.length; i++) {
                    var checker = response.data.data.available_courier_companies[i].courier_name.split('Surface');
                    if (checker.length > 1) {
                    
                        if (AirexpectedDelivery > response.data.data.available_courier_companies[i].estimated_delivery_days) {
                            AirexpectedDelivery = response.data.data.available_courier_companies[i].estimated_delivery_days;
                            AirDeliveryPartner = response.data.data.available_courier_companies[i].courier_name;
                            AirexpectedRate = response.data.data.available_courier_companies[i].rate;
                        }
                    } else {
                    
                        if (SurfaceexpectedDelivery > response.data.data.available_courier_companies[i].estimated_delivery_days) {
                            SurfaceexpectedDelivery = response.data.data.available_courier_companies[i].estimated_delivery_days;
                            SurfaceDeliveryPartner = response.data.data.available_courier_companies[i].courier_name;
                            SurfaceexpectedRate = response.data.data.available_courier_companies[i].rate;
                        }
                    }
                }
                return ({
                    air: {
                        AirexpectedDelivery: AirexpectedDelivery,
                        AirDeliveryPartner: AirDeliveryPartner,
                        AirexpectedRate: AirexpectedRate
                    },
                    surface: {
                        SurfaceexpectedDelivery: SurfaceexpectedDelivery,
                        SurfaceDeliveryPartner: SurfaceDeliveryPartner,
                        SurfaceexpectedRate: SurfaceexpectedRate
                    }
                })
            })
            .catch(function (error) {
                console.log(error);
            });
        return (retrunData);
    }


}


