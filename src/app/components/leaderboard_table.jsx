const React = require('react');

const Table = require('material-ui/lib/table/table');
const TableBody = require('material-ui/lib/table/table-body');
const TableFooter = require('material-ui/lib/table/table-footer');
const TableHeader = require('material-ui/lib/table/table-header');
const TableHeaderColumn = require('material-ui/lib/table/table-header-column');
const TableRow = require('material-ui/lib/table/table-row');
const TableRowColumn = require('material-ui/lib/table/table-row-column');

export default React.createClass({
  render: function () {
    return (
      <Table selectable={false}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Player</TableHeaderColumn>
            <TableHeaderColumn>Points</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {this.props.users.map(user =>
            <TableRow key={user.name}>
              <TableRowColumn>{user.name}</TableRowColumn>
              <TableRowColumn>{user.points}</TableRowColumn>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  },
})
