import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {

  constructor() { }

  public loadPaypalSubscription(): HTMLScriptElement {
    // document.querySelector('#paypalPayCantoApp').remove();
    const body = document.body as HTMLDivElement;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.id = 'paypalSubscriptionCantoApp';
    script.src = `https://www.paypal.com/sdk/js?client-id=${environment.paypal}&vault=true&disable-funding=credit&intent=subscription`;
    script.setAttribute('data-sdk-integration-source', 'button-factory');
    script.async = false;
    script.defer = true;
    body.appendChild(script);
    return script;
  }

  public loadPaypalPay(): HTMLScriptElement {
    // document.querySelector('#paypalSubscriptionCantoApp').remove();
    const body = document.body as HTMLDivElement;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.id = 'paypalPayCantoApp';
    script.src = `https://www.paypal.com/sdk/js?client-id=${environment.paypal}&disable-funding=credit`;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
    return script;
  }
}
