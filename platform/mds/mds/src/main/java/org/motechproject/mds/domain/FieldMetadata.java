package org.motechproject.mds.domain;

import org.motechproject.mds.dto.MetadataDto;
import org.motechproject.mds.util.Pair;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.NotPersistent;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

/**
 * The <code>FieldMetadata</code> class contains information about a single metadata added into
 * a field.
 */
@PersistenceCapable(identityType = IdentityType.DATASTORE, detachable = "true")
public class FieldMetadata implements Pair<String, String> {

    @PrimaryKey
    @Persistent(valueStrategy = IdGeneratorStrategy.NATIVE)
    private Long id;

    @Persistent
    private Field field;

    @Persistent
    private String key;

    @Persistent
    private String value;

    public FieldMetadata() {
        this(null, null);
    }

    public FieldMetadata(Field field, String key) {
        this(field, key, null);
    }

    public FieldMetadata(MetadataDto metadata) {
        update(metadata);
    }

    public FieldMetadata(Field field, String key, String value) {
        this.field = field;
        this.key = key;
        this.value = value;
    }

    public MetadataDto toDto() {
        return new MetadataDto(id, key, value);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Field getField() {
        return field;
    }

    public void setField(Field field) {
        this.field = field;
    }

    @Override
    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    @Override
    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public final void update(MetadataDto metadata) {
        key = metadata.getKey();
        value = metadata.getValue();
    }

    @NotPersistent
    public FieldMetadata copy() {
        FieldMetadata copy = new FieldMetadata();

        copy.setKey(key);
        copy.setValue(value);

        return copy;
    }
}
