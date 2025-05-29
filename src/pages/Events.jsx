// src/pages/Events.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Header } from '../components';
import { useAuth } from '../contexts/AuthContext';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Resize,
  Sort,
  ContextMenu,
  Filter,
  Page,
  ExcelExport,
  PdfExport,
  Edit,
  Inject,
  Toolbar
} from '@syncfusion/ej2-react-grids';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';

// Syncfusion themes
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-buttons/styles/material.css';
import '@syncfusion/ej2-inputs/styles/material.css';
import '@syncfusion/ej2-popups/styles/material.css';
import '@syncfusion/ej2-calendars/styles/material.css';
import '@syncfusion/ej2-dropdowns/styles/material.css';
import '@syncfusion/ej2-navigations/styles/material.css';
import '@syncfusion/ej2-react-grids/styles/material.css';

const API_BASE_URL = 'http://localhost:5001/api/events';
const IMAGE_UPLOAD_BASE_URL = 'http://localhost:5001';

// Global variable to store current dialog data
let currentDialogData = {};

// Custom Dialog Template Component
const EventDialogTemplate = (props) => {
  const [eventName, setEventName] = useState(props.eventName || '');
  const [description, setDescription] = useState(props.description || '');
  const [eventLocation, setEventLocation] = useState(props.eventLocation || '');
  const [eventDate, setEventDate] = useState(props.eventDate ? new Date(props.eventDate) : null);
  const [eventTime, setEventTime] = useState(props.eventTime || '00:00');
  const [eventStatus, setEventStatus] = useState(props.eventStatus || 'Scheduled');
  const [eventCost, setEventCost] = useState(props.eventCost || '');
  const [eventImageFile, setEventImageFile] = useState(null);
  const [eventImage, setEventImage] = useState(props.eventImage || '');

  // Status options for the dropdown
  const statusOptions = ['Scheduled', 'Postponed', 'Cancelled', 'Completed'];

  useEffect(() => {
    setEventName(props.eventName || '');
    setDescription(props.description || '');
    setEventLocation(props.eventLocation || '');
    setEventDate(props.eventDate ? new Date(props.eventDate) : null);
    setEventTime(props.eventTime || '00:00');
    setEventStatus(props.eventStatus || 'Scheduled');
    setEventCost(props.eventCost || '');
    setEventImage(props.eventImage || '');
    setEventImageFile(null);
  }, [props]);

  // Update global dialog data whenever state changes
  useEffect(() => {
    currentDialogData = {
      ...props,
      eventName,
      description,
      eventLocation,
      eventDate,
      eventTime,
      eventStatus,
      eventCost,
      eventImage,
      eventImageFile,
    };
  }, [eventName, description, eventLocation, eventDate, eventTime, eventStatus, eventCost, eventImage, eventImageFile, props]);

  const formRef = useRef(null);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.getData = () => {
        return currentDialogData;
      };
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventImageFile(file);
      setEventImage(URL.createObjectURL(file));
    } else {
      setEventImageFile(null);
      setEventImage('');
    }
  };

  return (
    <div ref={formRef} className="p-4">
      <h3 className="text-xl font-semibold mb-4">{props.isAdd ? 'Add New Event' : 'Edit Event'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="eventName">
            Event Name <span className="text-red-500">*</span>
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="eventName"
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="eventLocation">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="eventLocation"
            type="text"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
            required
          />
        </div>
        <div className="col-span-1">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="eventDate">
            Date <span className="text-red-500">*</span>
          </label>
          <DatePickerComponent
            id="eventDate"
            placeholder="Choose a date"
            value={eventDate}
            allowEdit={false}
            onChange={(e) => setEventDate(e.value)}
            format="yyyy-MM-dd"
            floatLabelType="Never"
            required
          />
        </div>
        <div className="col-span-1">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="eventTime">
            Time (HH:MM)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="eventTime"
            type="time"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="eventStatus">
            Status
          </label>
          <DropDownListComponent
            id="eventStatus"
            dataSource={statusOptions}
            value={eventStatus}
            change={(e) => setEventStatus(e.value)}
            placeholder="Select Status"
            floatLabelType="Never"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="eventCost">
            Cost
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="eventCost"
            type="text"
            value={eventCost}
            onChange={(e) => setEventCost(e.target.value)}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="eventImageFile">
            Event Image
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="eventImageFile"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {eventImage && (
            <img
              src={eventImage.startsWith('/uploads') ? `${IMAGE_UPLOAD_BASE_URL}${eventImage}` : eventImage}
              alt="Event Preview"
              className="mt-2 w-32 h-32 object-cover rounded"
            />
          )}
        </div>
      </div>
    </div>
  );
};

const Events = () => {
  const { isAuthenticated, loading: authLoading, logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const gridRef = useRef(null);

  const editOptions = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    showConfirmDialog: true,
    mode: 'Dialog',
    template: EventDialogTemplate,
    width: '600px',
    cssClass: 'e-dialog',
  };

  const toolbarOptions = ['Add', 'Edit', 'Delete', 'Search', 'ExcelExport', 'PdfExport'];

  const fetchEvents = async () => {
    if (authLoading) {
      console.log('AuthContext is still loading, deferring fetchEvents.');
      return;
    }

    if (!isAuthenticated) {
      setError('Authentication required to fetch events. Please log in.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(API_BASE_URL, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });

      const formattedEvents = response.data.map(event => ({
        ...event,
        eventName: event.eventName || event.title || '',
        eventLocation: event.eventLocation || event.location || '',
        eventDate: event.eventDate ? new Date(event.eventDate) : (event.startTime ? new Date(event.startTime) : null),
        eventTime: event.eventTime || (event.startTime ? new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '00:00'),
        customerName: event.customerName || 'N/A',
        eventStatus: event.eventStatus || 'Scheduled',
        eventImage: event.eventImage || '',
        eventCost: event.eventCost || 'N/A',
      }));
      setEvents(formattedEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.response?.data?.message || 'Failed to fetch events.');
      if (err.response && err.response.status === 401) {
        console.warn('Unauthorized: Token might be invalid or expired. Logging out.');
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [isAuthenticated, authLoading]);

  const actionBegin = (args) => {
    if (args.requestType === 'save') {
      console.log('ActionBegin - Current dialog data:', currentDialogData);
      Object.assign(args.data, currentDialogData);
      console.log('ActionBegin - Updated args.data:', args.data);
    }
  };

  const actionComplete = async (args) => {
    if (args.requestType !== 'save' && args.requestType !== 'delete') {
      return;
    }

    if (!isAuthenticated) {
      setError('Authentication required to perform this action.');
      if (args.requestType === 'save') {
        args.cancel = true;
      }
      return;
    }

    let apiCall;
    let method;
    let url;

    const currentData = args.requestType === 'delete' ? args.data[0] : args.data;

    if (!currentData) {
      console.warn("actionComplete called with no relevant data for CRUD operation.");
      setLoading(false);
      return;
    }

    console.log('Current data in actionComplete:', currentData);

    // Frontend Validation for Required Fields
    if (!currentData.eventName || (typeof currentData.eventName === 'string' && currentData.eventName.trim() === '')) {
      setError("Event Name is required.");
      args.cancel = true;
      setLoading(false);
      return;
    }
    if (!currentData.eventLocation || (typeof currentData.eventLocation === 'string' && currentData.eventLocation.trim() === '')) {
      setError("Location is required.");
      args.cancel = true;
      setLoading(false);
      return;
    }
    if (!currentData.eventDate || !(currentData.eventDate instanceof Date) || isNaN(currentData.eventDate.getTime())) {
      setError("Event Date is required and must be a valid date.");
      args.cancel = true;
      setLoading(false);
      return;
    }

    // Date/Time Formatting for Backend Payload
    const datePart = currentData.eventDate.toISOString().split('T')[0];
    const timePart = currentData.eventTime || '00:00';
    const combinedDateTime = new Date(`${datePart}T${timePart}:00.000Z`);

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('eventName', currentData.eventName);
    formData.append('description', currentData.description || '');
    formData.append('eventDate', currentData.eventDate.toISOString());
    formData.append('eventTime', currentData.eventTime || '00:00');
    formData.append('eventLocation', currentData.eventLocation);
    formData.append('eventStatus', currentData.eventStatus || 'Scheduled');
    formData.append('eventCost', currentData.eventCost || '');

    if (currentData.eventImageFile) {
      formData.append('eventImage', currentData.eventImageFile);
    } else if (currentData.eventImage === '') {
      formData.append('eventImage', '');
    }

    setLoading(true);
    setError(null);

    try {
      switch (args.requestType) {
        case 'save':
          if (args.action === 'add') {
            method = 'post';
            url = API_BASE_URL;
            apiCall = axios.post(url, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'x-auth-token': localStorage.getItem('token'),
              },
            });
          } else if (args.action === 'edit') {
            method = 'put';
            url = `${API_BASE_URL}/${currentData._id}`;
            apiCall = axios.put(url, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'x-auth-token': localStorage.getItem('token'),
              },
            });
          }
          break;
        case 'delete':
          method = 'delete';
          const idsToDelete = args.data.map(item => item._id);
          if (idsToDelete.length > 0) {
            url = `${API_BASE_URL}/${idsToDelete[0]}`;
            apiCall = axios.delete(url, {
              headers: {
                'x-auth-token': localStorage.getItem('token'),
              },
            });
          } else {
            setLoading(false);
            return;
          }
          break;
        default:
          setLoading(false);
          return;
      }

      if (apiCall) {
        const response = await apiCall;
        console.log(`${method.toUpperCase()} operation successful:`, response.data);
        await fetchEvents();
      }
    } catch (err) {
      console.error(`Error during ${method.toUpperCase()} operation:`, err);
      setError(err.response?.data?.msg || err.response?.data?.message || `Failed to ${method} event.`);
      if (args.requestType === 'save') {
        args.cancel = true;
      }
    } finally {
      setLoading(false);
    }
  };

  const eventImageTemplate = (props) => (
    <div className="flex justify-center items-center w-full h-full">
      <img
        src={props.eventImage && props.eventImage.startsWith('/uploads') ? `${IMAGE_UPLOAD_BASE_URL}${props.eventImage}` : (props.eventImage || 'https://placehold.co/150')}
        alt={props.eventName}
        className="w-16 h-16 object-cover rounded"
        onError={(e) => e.target.src = 'https://placehold.co/150'}
      />
    </div>
  );

  const eventStatusTemplate = (props) => {
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
  };

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl dark:bg-secondary-dark-bg">
      <Header category="Page" title="Events" />

      {(loading || authLoading) && <p className="text-center text-lg">Loading events...</p>}
      {error && <p className="text-center text-red-500 text-lg">{error}</p>}

      {!loading && !error && !authLoading && (
        <GridComponent
          id="eventsGrid"
          ref={gridRef}
          dataSource={events}
          allowPaging
          allowSorting
          editSettings={editOptions}
          toolbar={toolbarOptions}
          contextMenuItems={['Edit', 'Delete']}
          actionBegin={actionBegin}
          actionComplete={actionComplete}
          keyField="_id"
        >
          <ColumnsDirective>
            <ColumnDirective
              field="eventImage"
              headerText="Event Image"
              width="130"
              allowSorting={false}
              template={eventImageTemplate}
              textAlign="Center"
              headerTextAlign="Center"
              headerStyle={{ fontWeight: '600', fontSize: '14px', textAlign: 'center' }}
              editType="stringedit"
              allowEditing={true}
            />
            <ColumnDirective
              field="eventName"
              headerText="Event Name"
              width="150"
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
              type="date"
              format="yMd"
              editType="datepickeredit"
            />
            <ColumnDirective
              field="eventTime"
              headerText="Time"
              width="100"
              textAlign="Center"
              headerTextAlign="Center"
              headerStyle={{ fontWeight: '600', fontSize: '14px', textAlign: 'center' }}
              type="string"
              editType="stringedit"
            />
            <ColumnDirective
              field="description"
              headerText="Description"
              width="180"
              textAlign="Left"
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
              field="eventStatus"
              headerText="Status"
              width="130"
              textAlign="Center"
              headerTextAlign="Center"
              headerStyle={{ fontWeight: '600', fontSize: '14px', textAlign: 'center', paddingLeft: '8px' }}
              template={eventStatusTemplate}
            />
            <ColumnDirective
              field="eventCost"
              headerText="Event Cost"
              width="130"
              textAlign="Center"
              headerTextAlign="Center"
              headerStyle={{ fontWeight: '600', fontSize: '14px', textAlign: 'center' }}
            />
            <ColumnDirective
              field="_id"
              headerText="Event ID"
              width="130"
              textAlign="Center"
              headerTextAlign="Center"
              headerStyle={{ fontWeight: '600', fontSize: '14px', textAlign: 'center' }}
              visible={false}
              isPrimaryKey={true}
            />
          </ColumnsDirective>
          <Inject services={[Resize, Sort, ContextMenu, Filter, Page, ExcelExport, Edit, PdfExport, Toolbar]} />
        </GridComponent>
      )}
    </div>
  );
};

export default Events;