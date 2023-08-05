import { Model, DataTypes, Optional } from 'sequelize';
import { db } from '../config';
import { format, utcToZonedTime } from 'date-fns-tz';

interface MovieAttributes {
    id: number;
    title: string;
    description: string;
    rating?: number;
    image?: string;
    created_at: Date;
    updated_at: Date;
}

interface MovieCreationAttributes extends Optional<MovieAttributes, 'id' | 'created_at' | 'updated_at'> { }

class Movie extends Model<MovieAttributes, MovieCreationAttributes> implements MovieAttributes {
    public id!: number;
    public title!: string;
    public description!: string;
    public rating?: number;
    public image?: string;
    public created_at!: Date;
    public updated_at!: Date;

    private formatDate(date: Date | null | undefined, timezone: string): string | null {
        if (date) {
            const formattedDate = utcToZonedTime(date, timezone);
            return format(formattedDate, 'yyyy-MM-dd HH:mm:ss', { timeZone: timezone });
        }
        return null;
    }

    public getFormattedCreatedAt(): string | null {
        return this.formatDate(this.created_at, 'Asia/Jakarta');
    }

    public getFormattedUpdatedAt(): string | null {
        return this.formatDate(this.updated_at, 'Asia/Jakarta');
    }
}

Movie.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rating: {
        type: DataTypes.FLOAT,
    },
    image: {
        type: DataTypes.STRING,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize: db,
    tableName: 'movies',
    timestamps: false,
});

export { Movie };
