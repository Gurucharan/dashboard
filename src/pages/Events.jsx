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

// const API_BASE_URL = 'http://localhost:5001/api/events';
// const IMAGE_UPLOAD_BASE_URL = 'http://localhost:5001';
// Replace with your actual Render backend URL

const API_BASE_URL = process.env.REACT_APP_API_URL + '/api/events';
const IMAGE_UPLOAD_BASE_URL = process.env.REACT_APP_API_URL;

// const API_BASE_URL = 'https://elevate-hujm.onrender.com/api/events';
// const IMAGE_UPLOAD_BASE_URL = 'https://elevate-hujm.onrender.com';


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
          {/* Remove name attribute to prevent Syncfusion validation conflicts */}
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="eventName"
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            data-field="eventName"
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
            data-field="eventLocation"
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
            data-field="eventDate"
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
            data-field="eventTime"
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
            data-field="description"
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
            data-field="eventStatus"
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
            data-field="eventCost"
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
            data-field="eventImageFile"
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

  // Updated edit options to disable validation
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

  // Custom delete handler to avoid grid errors
  const handleCustomDelete = async (dataToDelete) => {
    if (!isAuthenticated) {
      setError('Authentication required to delete events.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete the selected event(s)?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const deletePromises = dataToDelete.map(item =>
        axios.delete(`${API_BASE_URL}/${item._id}`, {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        })
      );

      await Promise.all(deletePromises);
      console.log('Delete operation successful');

      // Refresh data after successful deletion
      await fetchEvents();

      // Clear any selected rows
      if (gridRef.current) {
        gridRef.current.clearSelection();
      }
    } catch (err) {
      console.error('Error during delete operation:', err);
      setError(err.response?.data?.msg || err.response?.data?.message || 'Failed to delete event.');
    } finally {
      setLoading(false);
    }
  };

  // Handle toolbar click events for export functionality with images
  const toolbarClick = (args) => {
    if (gridRef.current) {
      switch (args.item.id) {
        case 'eventsGrid_excelexport':
          // Prepare data with full image URLs for Excel export
          const excelDataWithImages = events.map((event) => {
            let fullImageUrl = 'No Image Available';

            if (event.eventImage) {
              // Ensure we always have the full URL for Excel export
              fullImageUrl = event.eventImage.startsWith('/uploads')
                ? `${IMAGE_UPLOAD_BASE_URL}${event.eventImage}`
                : event.eventImage;
            }

            return {
              ...event,
              // Override the eventImage field with full URL for export
              eventImage: fullImageUrl,
              eventImageUrl: fullImageUrl, // Additional field with full URL
              // Format date for better Excel display
              eventDate: event.eventDate ? new Date(event.eventDate).toLocaleDateString() : '',
              // Clean status for export
              eventStatus: event.eventStatus || 'Scheduled'
            };
          });

          const excelExportProperties = {
            fileName: `Events_WithImages_${new Date().toISOString().split('T')[0]}.xlsx`,
            dataSource: excelDataWithImages, // Use the modified data
            header: {
              headerRows: 2,
              rows: [
                {
                  cells: [{
                    colSpan: 8,
                    value: 'Events Management System - Complete Report',
                    style: { fontColor: '#C67878', fontSize: 20, hAlign: 'Center', bold: true }
                  }]
                },
                {
                  cells: [{
                    colSpan: 8,
                    value: `Export Date: ${new Date().toLocaleDateString()} | Total Events: ${events.length}`,
                    style: { fontColor: '#C67878', fontSize: 15, hAlign: 'Center', bold: true }
                  }]
                }
              ]
            },
            footer: {
              footerRows: 1,
              rows: [
                {
                  cells: [{
                    colSpan: 8,
                    value: 'Thank you for using Events Management System!',
                    style: { hAlign: 'Center', bold: true }
                  }]
                }
              ]
            },
            // Specify which columns to include and their order
            columns: [
              { field: 'eventImage', headerText: 'Image URL', width: 200 },
              { field: 'eventName', headerText: 'Event Name', width: 150 },
              { field: 'eventDate', headerText: 'Event Date', width: 120 },
              { field: 'eventTime', headerText: 'Time', width: 100 },
              { field: 'description', headerText: 'Description', width: 200 },
              { field: 'eventLocation', headerText: 'Location', width: 150 },
              { field: 'eventStatus', headerText: 'Status', width: 120 },
              { field: 'eventCost', headerText: 'Event Cost', width: 120 }
            ],
            includeHiddenColumn: false, // We're explicitly defining columns
            theme: {
              header: { fontColor: '#C67878' },
              record: { fontColor: '#000000' }
            }
          };
          gridRef.current.excelExport(excelExportProperties);
          break;

        case 'eventsGrid_pdfexport':
          // Prepare data with full image URLs for PDF export
          const pdfDataWithImages = events.map((event) => {
            let fullImageUrl = 'No Image Available';

            if (event.eventImage) {
              fullImageUrl = event.eventImage.startsWith('/uploads')
                ? `${IMAGE_UPLOAD_BASE_URL}${event.eventImage}`
                : event.eventImage;
            }

            return {
              ...event,
              // Override the eventImage field with full URL for export
              eventImage: fullImageUrl,
              eventImageUrl: fullImageUrl,
              // Format date for better PDF display
              eventDate: event.eventDate ? new Date(event.eventDate).toLocaleDateString() : '',
              // Clean status for export
              eventStatus: event.eventStatus || 'Scheduled'
            };
          });

          const pdfExportProperties = {
            fileName: `Events_WithImages_${new Date().toISOString().split('T')[0]}.pdf`,
            dataSource: pdfDataWithImages, // Use the modified data
            pageOrientation: 'Landscape',
            pageSize: 'A4',
            header: {
              fromTop: 0,
              height: 130,
              contents: [
                {
                  type: 'Text',
                  value: 'Events Management System - Complete Report',
                  position: { x: 0, y: 50 },
                  style: { textBrushColor: '#000000', fontSize: 18, fontFamily: 'TimesRoman', fontStyle: 'Bold' }
                },
                {
                  type: 'Text',
                  value: `Export Date: ${new Date().toLocaleDateString()} | Total Events: ${events.length}`,
                  position: { x: 0, y: 75 },
                  style: { textBrushColor: '#000000', fontSize: 12, fontFamily: 'TimesRoman' }
                }
              ]
            },
            footer: {
              fromBottom: 160,
              height: 150,
              contents: [
                {
                  type: 'PageNumber',
                  pageNumberType: 'Arabic',
                  format: 'Page {$current} of {$total}',
                  position: { x: 0, y: 25 },
                  style: { textBrushColor: '#ffbe00', fontSize: 15 }
                },
                {
                  type: 'Text',
                  value: 'Thank you for using Events Management System!',
                  position: { x: 0, y: 50 },
                  style: { textBrushColor: '#000000', fontSize: 12, fontFamily: 'TimesRoman' }
                }
              ]
            },
            // Specify columns for PDF with full URLs
            columns: [
              { field: 'eventImage', width: 120, headerText: 'Image URL' },
              { field: 'eventName', width: 100 },
              { field: 'eventDate', width: 80 },
              { field: 'eventTime', width: 60 },
              { field: 'description', width: 120 },
              { field: 'eventLocation', width: 80 },
              { field: 'eventStatus', width: 70 },
              { field: 'eventCost', width: 70 }
            ],
            allowHtmlString: true,
            hierarchyPrintMode: 'All'
          };
          gridRef.current.pdfExport(pdfExportProperties);
          break;

        default:
          break;
      }
    }
  };

  const actionBegin = (args) => {
    if (args.requestType === 'save') {
      console.log('ActionBegin - Current dialog data:', currentDialogData);

      // Custom validation before save
      if (!currentDialogData.eventName || currentDialogData.eventName.trim() === '') {
        setError('Event Name is required.');
        args.cancel = true;
        return;
      }

      if (!currentDialogData.eventLocation || currentDialogData.eventLocation.trim() === '') {
        setError('Location is required.');
        args.cancel = true;
        return;
      }

      if (!currentDialogData.eventDate || !(currentDialogData.eventDate instanceof Date) || isNaN(currentDialogData.eventDate.getTime())) {
        setError('Event Date is required and must be a valid date.');
        args.cancel = true;
        return;
      }

      // Clear any previous errors
      setError(null);

      Object.assign(args.data, currentDialogData);
      console.log('ActionBegin - Updated args.data:', args.data);
    }

    // Prevent default delete behavior and handle it manually
    if (args.requestType === 'delete') {
      args.cancel = true; // Cancel the default delete operation
      handleCustomDelete(args.data);
    }
  };

  const actionComplete = async (args) => {
    // Only handle save operations now, delete is handled in actionBegin
    if (args.requestType !== 'save') {
      return;
    }

    if (!isAuthenticated) {
      setError('Authentication required to perform this action.');
      args.cancel = true;
      return;
    }

    const currentData = args.data;
    if (!currentData) {
      console.warn("actionComplete called with no relevant data for CRUD operation.");
      setLoading(false);
      return;
    }

    console.log('Current data in actionComplete:', currentData);

    setLoading(true);
    setError(null);

    try {
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

      let apiCall;
      if (args.action === 'add') {
        apiCall = axios.post(API_BASE_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-auth-token': localStorage.getItem('token'),
          },
        });
      } else if (args.action === 'edit') {
        apiCall = axios.put(`${API_BASE_URL}/${currentData._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-auth-token': localStorage.getItem('token'),
          },
        });
      }

      if (apiCall) {
        const response = await apiCall;
        console.log(`${args.action.toUpperCase()} operation successful:`, response.data);

        // Refresh data after successful save
        await fetchEvents();
      }
    } catch (err) {
      console.error(`Error during ${args.action.toUpperCase()} operation:`, err);
      setError(err.response?.data?.msg || err.response?.data?.message || `Failed to ${args.action} event.`);
      args.cancel = true;
    } finally {
      setLoading(false);
    }
  };

  // Enhanced image template for better display and export compatibility
  const eventImageTemplate = (props) => {
    const imageUrl = props.eventImage && props.eventImage.startsWith('/uploads')
      ? `${IMAGE_UPLOAD_BASE_URL}${props.eventImage}`
      : (props.eventImage || 'https://placehold.co/150');

    return (
      <div className="flex justify-center items-center w-full h-full">
        <img
          src={imageUrl}
          alt={props.eventName || 'Event Image'}
          className="w-16 h-16 object-cover rounded shadow-sm"
          onError={(e) => {
            e.target.src = 'https://placehold.co/150x150/cccccc/666666?text=No+Image';
          }}
          loading="lazy"
          // Add data attributes for export functionality
          data-export-url={imageUrl}
          data-export-alt={props.eventName || 'Event Image'}
        />
      </div>
    );
  };

  // Export template for image column - returns full image URL for export
  const eventImageExportTemplate = (props) => {
    if (props.eventImage) {
      // Always return the full URL for exports
      const fullUrl = props.eventImage.startsWith('http')
        ? props.eventImage // Already a full URL
        : props.eventImage.startsWith('/uploads')
          ? `${IMAGE_UPLOAD_BASE_URL}${props.eventImage}` // Convert relative to full URL
          : props.eventImage; // Use as-is if it's something else
      return fullUrl;
    }
    return 'No Image Available';
  };

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

  // Export template for status column - returns text only for export
  const eventStatusExportTemplate = (props) => {
    return props.eventStatus || 'Unknown';
  };

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl dark:bg-secondary-dark-bg">
      {/* Custom CSS for compact filter popup */}
      <style>{`
        /* Compact Filter Dialog Styles */
        .e-grid .e-filter-popup {
          max-width: 280px !important;
          min-width: 250px !important;
          width: auto !important;
        }
        .e-grid .e-filter-popup .e-dlg-content {
          padding: 12px !important;
          max-height: 400px !important;
          overflow-y: auto !important;
        }
        .e-grid .e-filter-popup .e-dlg-header {
          padding: 8px 12px !important;
          font-size: 14px !important;
          min-height: 40px !important;
        }
        .e-grid .e-filter-popup .e-footer-content {
          padding: 8px 12px !important;
          min-height: 45px !important;
        }
        /* Compact filter form elements */
        .e-grid .e-filter-popup .e-input-group {
          margin-bottom: 8px !important;
        }
        .e-grid .e-filter-popup .e-input {
          height: 32px !important;
          font-size: 13px !important;
        }
        .e-grid .e-filter-popup .e-dropdownlist {
          height: 32px !important;
        }
        .e-grid .e-filter-popup .e-btn {
          height: 30px !important;
          padding: 4px 12px !important;
          font-size: 12px !important;
          margin: 2px !important;
        }
        /* Responsive positioning */
        .e-grid .e-filter-popup {
          position: absolute !important;
          z-index: 1000 !important;
        }
        /* Auto-adjust position for right-side columns */
        .e-grid .e-filter-popup.e-popup-right {
          transform: translateX(-100%) !important;
          left: auto !important;
          right: 20px !important;
        }
        /* Compact checkbox list */
        .e-grid .e-filter-popup .e-checkboxlist {
          max-height: 200px !important;
          overflow-y: auto !important;
        }
        .e-grid .e-filter-popup .e-list-item {
          padding: 4px 8px !important;
          font-size: 13px !important;
          line-height: 1.3 !important;
        }
        /* Compact date picker in filter */
        .e-grid .e-filter-popup .e-datepicker {
          height: 32px !important;
        }
        /* Responsive behavior */
        @media (max-width: 768px) {
          .e-grid .e-filter-popup {
            max-width: 90vw !important;
            left: 5vw !important;
            right: 5vw !important;
            transform: none !important;
          }
          
          .e-grid .e-filter-popup .e-dlg-content {
            max-height: 300px !important;
          }

            .e-grid .e-gridheader,
            .e-grid .e-gridcontent {
               overflow-x: auto !important;
          }

        }
        /* Prevent grid shifting */
        .e-grid {
          max-width: 100% !important;
          overflow: hidden !important;
        }
        .e-grid .e-gridcontent {
          overflow-x: auto !important;
        }

        .e-grid .e-content {
          overflow-x: auto !important;
        }

        /* Compact search box in toolbar */
        .e-grid .e-toolbar .e-search {
          max-width: 200px !important;
        }
        /* Better mobile responsiveness for grid */
        @media (max-width: 1024px) {
          .e-grid .e-gridheader,
          .e-grid .e-gridcontent {
            overflow-x: auto !important;
          }
          
          .e-grid .e-filter-popup {
            max-width: 300px !important;
            position: absolute !important;
          }
        }
        /* Ensure filter popup doesn't cause horizontal scroll */
        .e-grid-container {
          position: relative !important;
          overflow: visible !important;
        }
        /* Compact filter icon */
        .e-grid .e-filtericon {
          font-size: 12px !important;
        }
        /* Better spacing for filter elements */
        .e-grid .e-filter-popup .e-control-wrapper {
          margin-bottom: 6px !important;
        }
        .e-grid .e-filter-popup label {
          font-size: 12px !important;
          margin-bottom: 3px !important;
          display: block !important;
        }
        /* Compact button group in filter */
        .e-grid .e-filter-popup .e-btn-group .e-btn {
          padding: 3px 8px !important;
          font-size: 11px !important;
        }
        /* Scrollable content area */
        .e-grid .e-filter-popup .e-flmenu-content {
          max-height: 250px !important;
          overflow-y: auto !important;
        }
        /* Compact operator dropdown */
        .e-grid .e-filter-popup .e-flm_optrdiv {
          margin: 4px 0 !important;
        }
        /* Better mobile filter experience */
        @media (max-width: 640px) {
          .e-grid .e-filter-popup {
            max-width: 95vw !important;
            left: 2.5vw !important;
            right: 2.5vw !important;
            max-height: 80vh !important;
          }
          
          .e-grid .e-filter-popup .e-dlg-content {
            max-height: 60vh !important;
            padding: 8px !important;
          }
          
          .e-grid .e-filter-popup .e-btn {
            min-width: 60px !important;
            font-size: 11px !important;
          }
 
        }
      `}</style>

      <Header category="Page" title="Events" />

      {(loading || authLoading) && (
        <div className="text-center text-lg py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-3"></div>
          Loading events...
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 text-lg py-4 bg-red-50 rounded-lg mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {!loading && !error && !authLoading && (
        <div className="mt-6">
          <div className="overflow-x-auto">
            <GridComponent
              id="eventsGrid"
              ref={gridRef}
              dataSource={events}
              allowPaging
              allowSorting
              allowExcelExport
              allowPdfExport
              allowFiltering
              editSettings={editOptions}
              toolbar={toolbarOptions}
              contextMenuItems={['Edit', 'Delete']}
              actionBegin={actionBegin}
              actionComplete={actionComplete}
              toolbarClick={toolbarClick}
              keyField="_id"
              pageSettings={{ pageSize: 10, pageSizes: [10, 20, 50, 100] }}
              filterSettings={{
                type: 'Excel',
                showFilterBarStatus: true,
                immediateModeDelay: 1500,
                ignoreAccent: true
              }}
              width="100%"
              height="600"
              enableResponsiveRow={true}
              allowTextWrap={true}
              textWrapSettings={{ wrapMode: 'Content' }}
              allowResizing={true}
              gridLines="Both"
            >

              <ColumnsDirective>
                <ColumnDirective
                  field="eventImage"
                  headerText="Image"
                  width="100"
                  allowSorting={false}
                  allowFiltering={false}
                  template={eventImageTemplate}
                  exportTemplate={eventImageExportTemplate}
                  textAlign="Center"
                  headerTextAlign="Center"
                  headerStyle={{ fontWeight: '600', fontSize: '14px', textAlign: 'center' }}
                  editType="stringedit"
                  allowEditing={true}
                  includeInExport={true}
                  minWidth="80"
                />
                <ColumnDirective
                  field="eventName"
                  headerText="Event Name"
                  width="120"
                  textAlign="Left"
                  headerTextAlign="Center"
                  headerStyle={{ fontWeight: '600', fontSize: '14px', textAlign: 'center' }}
                  minWidth="100"
                  allowFiltering={true}
                />
                <ColumnDirective
                  field="eventDate"
                  headerText="Date"
                  width="110"
                  textAlign="Center"
                  headerTextAlign="Center"
                  headerStyle={{ fontWeight: '600', fontSize: '14px', textAlign: 'center' }}
                  type="date"
                  format="yMd"
                  editType="datepickeredit"
                  minWidth="90"
                  allowFiltering={true}
                />
                <ColumnDirective
                  field="eventTime"
                  headerText="Time"
                  width="80"
                  textAlign="Center"
                  headerTextAlign="Center"
                  headerStyle={{ fontWeight: '600', fontSize: '14px', textAlign: 'center' }}
                  type="string"
                  editType="stringedit"
                  minWidth="70"
                  allowFiltering={true}
                />
                <ColumnDirective
                  field="description"
                  headerText="Description"
                  width="150"
                  textAlign="Left"
                  headerTextAlign="Center"
                  headerStyle={{ fontWeight: '600', fontSize: '14px', textAlign: 'center' }}
                  editType="textareaedit"
                  minWidth="120"
                  allowFiltering={true}
                  clipMode="EllipsisWithTooltip"
                />
                <ColumnDirective
                  field="eventLocation"
                  headerText="Location"
                  width="110"
                  textAlign="Center"
                  headerTextAlign="Center"
                  headerStyle={{ fontWeight: '600', fontSize: '14px', textAlign: 'center' }}
                  minWidth="90"
                  allowFiltering={true}
                />
                <ColumnDirective
                  field="eventStatus"
                  headerText="Status"
                  width="120"
                  textAlign="Center"
                  headerTextAlign="Center"
                  headerStyle={{ fontWeight: '600', fontSize: '14px', textAlign: 'center' }}
                  template={eventStatusTemplate}
                  exportTemplate={eventStatusExportTemplate}
                  editType="dropdownedit"
                  edit={{ params: { dataSource: ['Scheduled', 'Postponed', 'Cancelled', 'Completed'] } }}
                  minWidth="100"
                  allowFiltering={true}
                  filterType="CheckBox"
                />
                <ColumnDirective
                  field="eventCost"
                  headerText="Cost"
                  width="90"
                  textAlign="Center"
                  headerTextAlign="Center"
                  headerStyle={{ fontWeight: '600', fontSize: '14px', textAlign: 'center' }}
                  editType="stringedit"
                  minWidth="70"
                  allowFiltering={true}
                />
                {/* Keep the hidden ID column as is */}
                <ColumnDirective
                  field="_id"
                  headerText="Event ID"
                  width="130"
                  textAlign="Center"
                  headerTextAlign="Center"
                  headerStyle={{ fontWeight: '600', fontSize: '14px', textAlign: 'center' }}
                  visible={false}
                  isPrimaryKey={true}
                  includeInExport={false}
                  allowEditing={false}
                  allowFiltering={false}
                />

              </ColumnsDirective>
              <Inject services={[Resize, Sort, ContextMenu, Filter, Page, ExcelExport, Edit, PdfExport, Toolbar]} />
            </GridComponent>
          </div>
        </div>
      )}

      {/* Loading overlay for export operations
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-lg">Processing request...</span>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Events;
