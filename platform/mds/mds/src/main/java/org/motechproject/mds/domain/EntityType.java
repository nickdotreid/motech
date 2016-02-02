package org.motechproject.mds.domain;

import org.motechproject.mds.util.ClassName;
import org.motechproject.mds.util.Constants;

/**
 * Represents the type of an entity and their associated class names.
 */
public enum EntityType {
    /**
     * Regular entity.
     */
    STANDARD {
        @Override
        public String getClassName(String className) {
            return className;
        }

        @Override
        public String getName(String name) {
            return name;
        }
    },
    /**
     * Entity representing a historical revision.
     */
    HISTORY {
        @Override
        public String getClassName(String className) {
            return ClassName.getHistoryClassName(className);
        }

        @Override
        public String getName(String name) {
            return name + Constants.HistoryTrash.HISTORY_SUFFIX;
        }
    },
    /**
     * Entity representing an instance in trash.
     */
    TRASH {
        @Override
        public String getClassName(String className) {
            return ClassName.getTrashClassName(className);
        }

        @Override
        public String getName(String name) {
            return name + Constants.HistoryTrash.TRASH_SUFFIX;
        }
    };

    public abstract String getClassName(String className);

    public abstract String getName(String name);

    /**
     * Returns the type of an entity, based on the class name.
     *
     * @param className class name to verify
     * @return type of an entity
     */
    public static EntityType forClassName(String className) {
        if (ClassName.isHistoryClassName(className)) {
            return HISTORY;
        } else if (ClassName.isTrashClassName(className)) {
            return TRASH;
        } else {
            return STANDARD;
        }
    }

    public String getTableName(String originalName) {
        String tableName = originalName;
        if (!EntityType.STANDARD.equals(this)) {
            tableName = tableName.concat("__").concat(this.toString());
        }

        return tableName;
    }
}
