/** @jsx React.DOM */

var React = require('react/addons');

var C = require('../constants');
var routesStore = require('../stores/routes');
var Selector = require('./selector');
var PersonPicker = require('./person_picker');
var actions = require('../actions/me_actions');

module.exports = React.createClass({
  getInitialState: function() {
    return {routes: routesStore.routes}
  },
  _onRoutesChange: function() {
    this.setState( {routes: routesStore.routes} );
  },
  _handleNewLog: function() {
    if (!this.refs.routeSelector.state.selectedRef) {
      alert ("Please make sure you selected route");
      return
    }
    actions.newLog(this.refs.routeSelector.state.selectedRef, this.refs.personPicker.state.selected);
    $('#dialogNewLog').modal('hide');
  },
  componentDidMount: function() {
    routesStore.addChangeListener(this._onRoutesChange);
  },
  componentWillUnmount: function() {
    routesStore.removeChangeListener(this._onRoutesChange);
  },
  render: function() {
    var defaultIndex = 0;
    var routeOptions = this.state.routes.map(function(route, index) {
      if (route.rating === C.Ratings.all[0]) { // "cupcake"
        defaultIndex = index;
      }
      var style = {
        "background-color": route.background_color,
        "color": route.color,
        "padding": "4px 8px 4px 8px",
      };
      return {
        dom: (
              <span style={style}>
                {route.setter} | {route.name} | {route.rating} | {route.ff ? "FF" : "AF"} | {C.Nats.all[route.nats]}
              </span>
             ),
        ref: route,
      };
    }.bind(this));
    return (
      <div className="clearfix">
        <button type="button" className="btn btn-warning pull-right" data-toggle="modal" data-target="#dialogNewLog">New Pitch</button>
        <div className="modal fade" id="dialogNewLog" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" ref="dialogNewLog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                <h4 className="modal-title">Record a New Pitch</h4>
              </div>
              <div className="modal-body container-fluid">
                <form role="form">

                  <div className="form-group">
                    <label>Route</label>
                    <div><Selector options={routeOptions} defaultIndex={defaultIndex} ref="routeSelector" /></div>
                  </div>

                  <div className="form-group">
                    <label>Partner</label>
                    <PersonPicker ref="personPicker"/>
                  </div>

                </form>
              </div>
              <div className="modal-footer">
                <div className="swear-to-aubie">By clicking submit, I swear to Mr. Aubie that I did climb the route at Auburn University Recreation Center following the route specs.</div>
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" onClick={this._handleNewLog}>Create</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
});