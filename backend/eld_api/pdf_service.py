from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from io import BytesIO
from datetime import datetime


class ELDPDFService:
    """Service for generating PDF ELD log sheets"""
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.title_style = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=16,
            spaceAfter=30,
            alignment=1  # Center alignment
        )
    
    def generate_log_sheet_pdf(self, log_sheet, trip):
        """Generate a PDF for a single log sheet"""
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        story = []
        
        # Title
        title = Paragraph(f"ELD Log Sheet - {log_sheet.date}", self.title_style)
        story.append(title)
        
        # Trip Information
        trip_info = [
            ['Driver Name:', log_sheet.driver_name],
            ['Vehicle ID:', log_sheet.vehicle_id],
            ['Date:', str(log_sheet.date)],
            ['Trip ID:', str(trip.id)],
            ['Pickup:', trip.pickup_location],
            ['Dropoff:', trip.dropoff_location],
        ]
        
        trip_table = Table(trip_info, colWidths=[2*inch, 4*inch])
        trip_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.grey),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('BACKGROUND', (1, 0), (1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        story.append(trip_table)
        story.append(Spacer(1, 20))
        
        # Hours of Service Summary
        story.append(Paragraph("Hours of Service Summary", self.styles['Heading2']))
        hours_data = [
            ['Status', 'Hours'],
            ['Driving', str(log_sheet.driving_hours)],
            ['On Duty', str(log_sheet.on_duty_hours)],
            ['Off Duty', str(log_sheet.off_duty_hours)],
            ['Sleeper Berth', str(log_sheet.sleeper_hours)],
        ]
        
        hours_table = Table(hours_data, colWidths=[3*inch, 1*inch])
        hours_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        story.append(hours_table)
        story.append(Spacer(1, 20))
        
        # Cycle Information
        story.append(Paragraph("Cycle Information", self.styles['Heading2']))
        cycle_data = [
            ['Metric', 'Value'],
            ['Cycle Hours Used', f"{log_sheet.cycle_hours_used} / 70"],
            ['Cycle Hours Remaining', str(log_sheet.cycle_hours_remaining)],
            ['Total Distance', f"{log_sheet.total_distance} miles"],
            ['Fuel Stops', str(log_sheet.fuel_stops)],
            ['Rest Stops', str(log_sheet.rest_stops)],
        ]
        
        cycle_table = Table(cycle_data, colWidths=[3*inch, 2*inch])
        cycle_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        story.append(cycle_table)
        story.append(Spacer(1, 20))
        
        # Daily Log Entries
        if log_sheet.entries:
            story.append(Paragraph("Daily Log Entries", self.styles['Heading2']))
            
            entries_data = [['Time', 'Status', 'Location', 'Remarks']]
            for entry in log_sheet.entries:
                entries_data.append([
                    str(entry.time),
                    entry.status.replace('_', ' ').title(),
                    entry.location,
                    entry.remarks
                ])
            
            entries_table = Table(entries_data, colWidths=[1*inch, 1.5*inch, 2*inch, 2.5*inch])
            entries_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 8),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ]))
            story.append(entries_table)
        
        # Footer
        story.append(Spacer(1, 30))
        footer_text = f"Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} by Trucking ELD System"
        story.append(Paragraph(footer_text, self.styles['Normal']))
        
        doc.build(story)
        buffer.seek(0)
        return buffer 