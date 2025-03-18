export interface Case {
  id: string;
  title: string;
  description: string;
  status: 'New' | 'In Progress' | 'On Hold' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  customerId: string;
  customerName: string;
  assignedTo?: string;
  createdDate: Date;
  updatedDate: Date;
  dueDate?: Date;
  tags?: string[];
  attachments?: Attachment[];
  comments?: Comment[];
}

export interface Attachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: Date;
  uploadedBy: string;
  url: string;
}

export interface Comment {
  id: string;
  text: string;
  createdBy: string;
  createdDate: Date;
  isInternal: boolean;
}
