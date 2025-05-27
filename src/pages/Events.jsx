import React from 'react'
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, ExcelExport, PdfExport, Edit, Inject, Toolbar } from '@syncfusion/ej2-react-grids';
import { ordersData, contextMenuItems, ordersGrid, eventsData } from '../data/dummy';
import { Header } from '../components';
import { CheckBox } from '@syncfusion/ej2/buttons';

const Events = () => {
  const editOptions = { allowEditing: true, allowAdding: true, allowDeleting: true, showConfirmDialog: false, mode: 'Dialog' };
  const toolbarOptions = ['Add', 'Edit', 'Delete'];

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Events" />
      <GridComponent
        id="gridcomp"
        dataSource={eventsData}
        keyField="eventId"
        allowPaging
        allowSorting
        editSettings={editOptions}
        toolbar={toolbarOptions}
      >
        <ColumnsDirective>
          <ColumnDirective
            field="eventImage"
            headerText="Event Image"
            width="130"
            allowSorting={false}
            template={(props) => (
              <div className="flex justify-center items-center w-full h-full">
                <img
                  src={props.eventImage || 'https://via.placeholder.com/64'}
                  alt={props.eventName}
                  className="w-16 h-16 object-cover rounded"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/64'}
                />
              </div>
            )}
            textAlign="Center"
            headerTextAlign="Center"
            headerStyle={{
              fontWeight: '600',
              fontSize: '14px',
              textAlign: 'center',
            }}
          />
          <ColumnDirective
            field="eventName"
            headerText="Event Name"
            width="130"
            textAlign="Center"
            headerTextAlign="Center"
            headerStyle={{ fontWeight: '600', fontSize: '14px', textAlign: 'center' }}
          />
          <ColumnDirective
            field="eventDate"
            headerText="Event Date"
            width="130"
            textAlign="Center"
            headerTextAlign="Center"
            headerStyle={{ fontWeight: '600', fontSize: '14px', textAlign: 'center' }}
          />
          <ColumnDirective
            field="customerName"
            headerText="Customer Name"
            width="150"
            textAlign="Center"
            headerTextAlign="Center"
            headerStyle={{ fontWeight: '600', fontSize: '14px', textAlign: 'center' }}
          />
          <ColumnDirective
            field="eventStatus"
            headerText="Status"
            width="130"
            textAlign="Center"
            headerTextAlign="Center"
            headerStyle={{ fontWeight: '600', fontSize: '14px', textAlign: 'center', paddingLeft: '8px' }}
            template={(props) => {
              let bgColor = '';
              switch (props.eventStatus) {
                case 'Scheduled':
                  bgColor = 'bg-green-200 text-green-800';
                  break;
                case 'Postponed':
                  bgColor = 'bg-yellow-200 text-yellow-800';
                  break;
                case 'Cancelled':
                  bgColor = 'bg-red-200 text-red-800';
                  break;
                case 'Completed':
                  bgColor = 'bg-blue-200 text-blue-800';
                  break;
                default:
                  bgColor = 'bg-gray-200 text-gray-800';
              }

              return (
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${bgColor}`}>
                  {props.eventStatus}
                </span>
              );
            }}
          />

          <ColumnDirective
            field="eventId"
            headerText="Event ID"
            width="130"
            textAlign="Center"
            headerTextAlign="Center"
            headerStyle={{ fontWeight: '600', fontSize: '14px', textAlign: 'center' }}
          />
          <ColumnDirective
            field="eventLocation"
            headerText="Location"
            width="130"
            textAlign="Center"
            headerTextAlign="Center"
            headerStyle={{ fontWeight: '600', fontSize: '14px', textAlign: 'center' }}
          />
          <ColumnDirective
            field="eventCost"
            headerText="Event Cost"
            width="130"
            textAlign="Center"
            headerTextAlign="Center"
            headerStyle={{ fontWeight: '600', fontSize: '14px', textAlign: 'center' }}
          />
        </ColumnsDirective>
        <Inject services={[Resize, Sort, ContextMenu, Filter,
          Page, ExcelExport, Edit, PdfExport, Toolbar
        ]} />
      </GridComponent>
    </div>
  )
}

export default Events