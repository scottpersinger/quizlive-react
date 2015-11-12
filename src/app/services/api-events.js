import { EventEmitter } from 'events';

import io from 'socket.io-client';

import { API_BASE_URL } from '../config.js';

class APIEventListener extends EventEmitter {
  constructor() {
    super();

    let socket = this.socket = io(API_BASE_URL, {transports:['websocket']});

    // attach core event handlers
    socket.on('connect', () => { console.debug('socket connect'); this.emit('connect'); });
    socket.on('error', () => { console.debug('socket error'); this.emit('error'); });
    socket.on('disconnect', () => { console.debug('socket disconnect'); this.emit('disconnect'); });
    socket.on('reconnect', this._handleReconnect.bind(this));
    socket.on('reconnect_attempt', () => { console.debug(`socket reconnect_attempt`); });
    socket.on('reconnecting', attempts => { console.debug(`socket reconnecting: #${attempts}`); });
    socket.on('reconnect_error', err => { console.debug(`socket reconnect_error: ${err}`); });
    socket.on('reconnect_failed', attempts => { console.debug(`socket reconnect_failed event; attempts: ${attempts}`); });

    socket.on('notify', this._handleNotify.bind(this));
  }

  _handleReconnect(attempts) {
    console.debug(`socket reconnect after ${attempts} attempts`);
    this.emit('reconnect');
  }

  _handleNotify(data) {
    console.debug(data);
    this.emit(data.resource, data);
  }

  subscribe(resource, handler) {
    console.log('subscribe', arguments);

    // only one subscription per resource
    if (EventEmitter.listenerCount(this, resource) !== 0) {
      throw new Error('api-listener: Cannot subscribe to resource "' + resource + '" more than once.');
    }

    this.addListener(resource, handler);
    this.socket.emit('subscribe', resource);

    return this;
  }

  unsubscribe(resource, handler){
    console.log('unsubscribe', arguments);

    this.removeListener(resource, handler);

    // if there's no more handlers for this resource, unsubscribe from it completely
    if (EventEmitter.listenerCount(this, resource) === 0) {
      this.socket.emit('unsubscribe', resource);
    }
    return this;
  }

  isConnected() {
    return this.socket.connected;
  }

  isDisconnected() {
    return this.socket.disconnected;
  }
}

export default function () {
  return new APIEventListener();
}
