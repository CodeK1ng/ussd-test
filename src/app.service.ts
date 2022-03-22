import { Injectable, Req, Res } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
const UssdMenu = require('ussd-menu-builder');
let menu = new UssdMenu();


@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async ussdMenu(req: Request, res: Response, next: NextFunction) {
    let menu = new UssdMenu();    

    // Define menu states
    await this.startMenu(menu);
    await this.showInvestmentPlanMenu(menu);
    await this.enterInvestmentAmount(menu);
    await this.makePaymentMenu(menu)
    
    // Registering USSD handler with Express

    // let args = {
    //     phoneNumber: req.body.phoneNumber,
    //     sessionId: req.body.sessionId,
    //     serviceCode: req.body.serviceCode,
    //     text: req.body.text
    // };
    // menu.run(args, resMsg => {
    //     res.send(resMsg);
    // });
    

    menu.run(req.body, ussdResult => {
        res.send(ussdResult);
    });
    menu.on('error', (err) => {
        // handle errors
        res.status(400).send('An error occurred');
    });
}


    public async startMenu(menu) {
        menu.startState({
            run: () => {
                // use menu.con() to send response without terminating session      
                menu.con('Hi Vincent, Welcome to Patumba:' +
                    '\n1. Investment Plan' +
                    '\n2. Education Plan' +
                    '\n3. Retirement Plan'
                );
            },
            // next object links to next state based on user input
            next: {
                '1': 'showInvestmentPlan',
                '2': 'buyAirtime',
                '3': 'MakePayment'
            }
        });
    }

    public async showInvestmentPlanMenu(menu) {
      menu.state('showInvestmentPlan', {
          run: () => {
              menu.con('Investment Plan:' +
              ' \n1. Invest' +
              ' \n2. Withdraw' +
              ' \n3. View Portfolio' +
              ' \n4. Back');
          },
          next: {
            '1': 'enterInvestmentAmount',
            '2': 'showInvestmentPlan.withdraw',
            '3': 'showInvestmentPlan.viewPortfolio',
            '4': 'start'
          }
      });

  }



  public async enterInvestmentAmount(menu) {
      menu.state('enterInvestmentAmount', {
          run: () => {
              menu.con('Enter amount you want to invest:');
          },
          next: {
              // using regex to match user input to next state
              '*\\d+': 'showInvestmentPlanTenures.amount'
          }
      });

      // nesting states
      menu.state('showInvestmentPlanTenures.amount', {
          run: () => {
              // use menu.val to access user input value
              var amount = Number(menu.val);
              console.log('Amount to invest =>',amount);

              menu.con('Please select tenure:' + 
                        '\n1. 1 Year' +
                        '\n2. 2 Years' +
                        '\n3. 3 Years' 
                      );
          },

      });
  }

  // public async showInvestmentPlanTenuresMenu(menu) {
  //   menu.state('showInvestmentPlanTenures', {
  //     run: () => {
  //       var amount = Number(menu.val);
  //       console.log('Amount to invest =>',amount);
        
  //         menu.con('Please select tenure:' + 
  //           '\n1. 1 Year' +
  //           '\n2. 2 Years' +
  //           '\n3. 3 Years' 
  //         );
  //     },
  //     next: {
  //         // using regex to match user input to next state
  //         '*\\d+': 'enterInvestmentAmount.amount'
  //     }
  // });
  // }

  public async makePaymentMenu(menu) {
    // nesting states
    menu.state('MakePayment', {
        run: () => {
            menu.con('Enter Amount-CardNumber-MM-YY-CVV');
            // var amount = Number(menu.val);
            // savePaymentAmount(menu.args.phoneNumber, amount).then(res=>{});
        },
        next: {
            // using regex to match user input to next state
            '*\\d+-\\d\\d\\d\\d\\d\\d\\d\\d\\d\\d\\d\\d\\d\\d\\d\\d-\\d\\d-\\d\\d-\\d\\d\\d': 'MakePayment.cardDetails'
        }
    });

    // nesting states
    menu.state('MakePayment.cardDetails', {
        run: async () => {
            var card_details = menu.val.split("-");
            let result = await this.makePayment(menu.args.phoneNumber, card_details)
            if (result['body']['status']=='success') {
                menu.end('Payment successfully made with reference: ' + result['body']['reference']);
            } else {
                menu.end('Payment was NOT successfully! Please try again');
            }
        },
        next: {
            // using regex to match user input to next state
            //  '*\\d+': 'MakePayment.cardDetails'
        }
    });
}



public async makePayment(phoneNumber, card_details) {
    //2000,1234567676543212,12,18,123

    return new Promise((resolve, reject) => {
        console.log("card Details : " + card_details);
        card_details[0]
        //initiate Payment
        
        // resolve(ref); 
    })
}


async buyAirtime(phoneNumber, amount) {
    return new Promise((resolve, reject) => {
        console.log("buyAirtime Amount: " + amount);
        console.log("buyAirtime Mobile: " + phoneNumber)
        resolve(amount);
        reject("An error occurred, try again later")
    })
}


async fetchBalance(phoneNumber) {
    return new Promise((resolve, reject) => {
        console.log("FetchBalance Mobile: " + phoneNumber)
        resolve(50000);
        reject("An error occurred, try again later");
    })
}



  
}
