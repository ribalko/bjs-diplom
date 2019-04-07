class Profile {

    constructor(user) {
        this.username = user.username;
        this.name = user.name;
        this.password = user.password;
    }

    createUser({ username, name, password}, callback) {
        return ApiConnector.createUser({ username, name, password }, (err, data) => {
            console.log(`Creating user ${username}`);
            callback(err, data);
        });
    }

    performLogin({ username, password }, callback) {
        return ApiConnector.performLogin({ username, password }, (err, data) => {
            console.log(`Logging in user ${username}`);
            callback(err, data);
        });        
    }    

    addMoney({ currency, amount }, callback) {
        return ApiConnector.addMoney({ currency, amount }, (err, data) => {
            console.log(`Adding ${amount} of ${currency} to ${this.username}`);
            callback(err, data);
        });
    }

    transferMoney({ to, amount }, callback) {
        return ApiConnector.transferMoney({ to, amount }, (err, data) => {
            console.log(`Transfer ${amount} from ${this.username} to ${to}`);
            callback(err, data);
        });        
    }

    convertMoney({ fromCurrency, targetCurrency, targetAmount }, callback) {
        return ApiConnector.transferMoney({ fromCurrency, targetCurrency, targetAmount }, (err, data) => {
            console.log(`Successfully converting ${targetAmount} from ${fromCurrency} to ${targetCurrency}`);
            callback(err, data);
        });        
    }

}


function main(){


    // я знаю, что объект market, который хранит массив курсов валют к Неткоину, описан в модуле stocks. Но как к нему обратиться я не могу понять. require выдает ошибку.
    
    const Ivan = new Profile({
                    username: 'invan',
                    name: { firstName: 'Ivan', lastName: 'Chernyshev' },
                    password: 'ivanspass',
                });

    const Petya = new Profile({
                    username: 'petya',
                    name: { firstName: 'Petr', lastName: 'Sergeev' },
                    password: 'petrspass',
                });                
    
    ApiConnector.getStocks((err, data) => {console.log(`Getting stocks info`)});
    
    console.log(market);

    // сначала создаем и авторизуем пользователя
    Ivan.createUser({ username: Ivan.username, name: Ivan.name, password: Ivan.password}, (err, data) => {
        if (err) {
            console.error(`Error during creating ${Ivan.username}`);
        }
        else {
            console.log(`User ${Ivan.username} successfully created`);
        }
    });

    Ivan.performLogin({ username: Ivan.username, password: Ivan.password }, (err, data) => {
        if (err) {
           console.error(`Error during logging in ${Ivan.username}`);
            }
        else {
            console.log(`User ${Ivan.username} successfully logging in`);
        }
    });
    

    // создаем второго пользователя
    Petya.createUser({ username: Petya.username, name: Petya.name, password: Petya.password}, (err, data) => {
        if (err) {
            console.error(`Error during creating ${Petya.username}`);
        }
        else {
            console.log(`User ${Petya.username} successfully created`);
        }
    });    

    // после того, как мы авторизовали пользователя, добавляем ему денег в кошелек
    Ivan.addMoney({ currency: 'EUR', amount: 500000 }, (err, data) => {
        if (err) {
            console.error(`Error during adding money to ${Ivan.username}`);
            } else {
                console.log(`Added 500000 euros to ${Ivan.username}`);
        }
    });

    // переведем Евро в Неткоины
    Ivan.convertMoney({ fromCurrency: 'EUR', targetCurrency: 'Неткоин', targetAmount: 500000 }, (err, data) => {
        if (err) {
            console.error(`Error converting money from EUR to Неткоин`);
            } else {
                console.log(`Successfully converted 500000 EUR to Неткоин`);
        }
    });

    // переведеи Неткоины Пете
    Ivan.transferMoney({ to: Petya.username, amount: 500000 }, (err, data) => {
        if (err) {
            console.error(`Error during transfer money to ${Petya.username}`);
            } else {
                console.log(`Successfully transfered 500000 euros to ${Petya.username}`);
        }
    });

}

main();