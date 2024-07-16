// import { useParams } from 'react-router-dom';
// import ReportForm from './ReportForm';
// import { useDispatch, useSelector } from 'react-redux';
// import { getSingleReport, updateReport } from '../store/reports';
// import { useEffect } from 'react';

// const EditReportForm = () => {
//   const { reportId } = useParams();
//   const dispatch = useDispatch();
//   const report = useSelector(state => state.reports[reportId]);

//   useEffect(() => {
//     dispatch(getSingleReport(reportId))
//   }, [dispatch, reportId])


//   if (!report) return(<></>);

//   /* **DO NOT CHANGE THE RETURN VALUE** */
//   return (
//     Object.keys(report).length > 1 && (
//       <>
//         <ReportForm
//           report={report}
//           formType="Update Report"
//         />
//       </>
//     )
//   );
// };

// export default EditReportForm;