// Data service to handle all data operations with mock JSON files

export interface Entity {
  id: number;
  name: string;
  code: string;
  description: string;
  createdAt: string;
}

export interface SubEntity {
  id: number;
  name: string;
  code: string;
  description: string;
  entityId: number;
  createdAt: string;
}

export interface Officer {
  id: number;
  name: string;
  rank: string;
  designation: string;
  subEntityId: number;
  email: string;
  phone: string;
  createdAt: string;
}

export interface Notification {
  id: number;
  createdAt: string;

  // Core display
  title: string;
  message: string;
  summary?: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;

  // Rich card fields (used by NotifCard in dashboard hub)
  tag?: string;           // e.g. 'Recruitment', 'Workshop'
  tagColor?: string;      // e.g. '#1C4587'
  icon?: string;          // emoji e.g. '📋'
  date?: string;          // posted date display string

  // Structured job fields
  advtId?: string;        // Advertisement number
  entityName?: string;    // Organisation name
  dateOfOpening?: string; // Opening date display string
  dateOfClosing?: string; // Closing date display string
  jobLink?: string;       // URL to official posting

  // Legacy fields (kept for backward compat)
  entity?: string;
  vacancies?: number;
  lastDate?: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  role: string;
}

class DataService {
  private entities: Entity[] = [];
  private subEntities: SubEntity[] = [];
  private officers: Officer[] = [];
  private notifications: Notification[] = [];
  private users: User[] = [];
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    try {
      const [entitiesData, subEntitiesData, officersData, notificationsData, usersData] =
        await Promise.all([
          fetch('/data/entities.json').then((r) => r.json()),
          fetch('/data/sub-entities.json').then((r) => r.json()),
          fetch('/data/officers.json').then((r) => r.json()),
          fetch('/data/notifications.json').then((r) => r.json()),
          fetch('/data/users.json').then((r) => r.json()),
        ]);

      this.entities = entitiesData;
      this.subEntities = subEntitiesData;
      this.officers = officersData;
      this.notifications = notificationsData;
      this.users = usersData;
      this.initialized = true;
    } catch (error) {
      console.error('[v0] Error loading data:', error);
      throw error;
    }
  }

  // Entity methods
  async getEntities(): Promise<Entity[]> {
    await this.initialize();
    return this.entities;
  }

  async addEntity(entity: Omit<Entity, 'id' | 'createdAt'>): Promise<Entity> {
    await this.initialize();
    const newEntity: Entity = {
      ...entity,
      id: Math.max(...this.entities.map((e) => e.id), 0) + 1,
      createdAt: new Date().toISOString(),
    };
    this.entities.push(newEntity);
    return newEntity;
  }

  async updateEntity(id: number, entity: Partial<Entity>): Promise<Entity> {
    await this.initialize();
    const index = this.entities.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Entity not found');
    this.entities[index] = { ...this.entities[index], ...entity };
    return this.entities[index];
  }

  async deleteEntity(id: number): Promise<void> {
    await this.initialize();
    this.entities = this.entities.filter((e) => e.id !== id);
  }

  // SubEntity methods
  async getSubEntities(): Promise<SubEntity[]> {
    await this.initialize();
    return this.subEntities;
  }

  async getSubEntitiesByEntity(entityId: number): Promise<SubEntity[]> {
    await this.initialize();
    return this.subEntities.filter((se) => se.entityId === entityId);
  }

  async addSubEntity(subEntity: Omit<SubEntity, 'id' | 'createdAt'>): Promise<SubEntity> {
    await this.initialize();
    const newSubEntity: SubEntity = {
      ...subEntity,
      id: Math.max(...this.subEntities.map((e) => e.id), 0) + 1,
      createdAt: new Date().toISOString(),
    };
    this.subEntities.push(newSubEntity);
    return newSubEntity;
  }

  async updateSubEntity(id: number, subEntity: Partial<SubEntity>): Promise<SubEntity> {
    await this.initialize();
    const index = this.subEntities.findIndex((se) => se.id === id);
    if (index === -1) throw new Error('SubEntity not found');
    this.subEntities[index] = { ...this.subEntities[index], ...subEntity };
    return this.subEntities[index];
  }

  async deleteSubEntity(id: number): Promise<void> {
    await this.initialize();
    this.subEntities = this.subEntities.filter((se) => se.id !== id);
  }

  // Officer methods
  async getOfficers(): Promise<Officer[]> {
    await this.initialize();
    return this.officers;
  }

  async getOfficersBySubEntity(subEntityId: number): Promise<Officer[]> {
    await this.initialize();
    return this.officers.filter((o) => o.subEntityId === subEntityId);
  }

  async addOfficer(officer: Omit<Officer, 'id' | 'createdAt'>): Promise<Officer> {
    await this.initialize();
    const newOfficer: Officer = {
      ...officer,
      id: Math.max(...this.officers.map((e) => e.id), 0) + 1,
      createdAt: new Date().toISOString(),
    };
    this.officers.push(newOfficer);
    return newOfficer;
  }

  async updateOfficer(id: number, officer: Partial<Officer>): Promise<Officer> {
    await this.initialize();
    const index = this.officers.findIndex((o) => o.id === id);
    if (index === -1) throw new Error('Officer not found');
    this.officers[index] = { ...this.officers[index], ...officer };
    return this.officers[index];
  }

  async deleteOfficer(id: number): Promise<void> {
    await this.initialize();
    this.officers = this.officers.filter((o) => o.id !== id);
  }

  // Notification methods
  async getNotifications(): Promise<Notification[]> {
    await this.initialize();
    return this.notifications;
  }

  async addNotification(
    notification: Omit<Notification, 'id' | 'createdAt'>
  ): Promise<Notification> {
    await this.initialize();
    const newNotification: Notification = {
      ...notification,
      id: Math.max(...this.notifications.map((e) => e.id), 0) + 1,
      createdAt: new Date().toISOString(),
    };
    this.notifications.push(newNotification);
    return newNotification;
  }

  async markNotificationAsRead(id: number): Promise<Notification> {
    await this.initialize();
    const index = this.notifications.findIndex((n) => n.id === id);
    if (index === -1) throw new Error('Notification not found');
    this.notifications[index].read = true;
    return this.notifications[index];
  }

  async deleteNotification(id: number): Promise<void> {
    await this.initialize();
    this.notifications = this.notifications.filter((n) => n.id !== id);
  }

  // User methods
  async getUsers(): Promise<User[]> {
    await this.initialize();
    return this.users;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    await this.initialize();
    return this.users.find((u) => u.username === username);
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    await this.initialize();
    const user = this.users.find((u) => u.username === username && u.password === password);
    return user || null;
  }
}

export const dataService = new DataService();