package com.gsr.blogger.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A DTO for the {@link com.gsr.blogger.domain.Channel} entity.
 */
public class ChannelDTO implements Serializable {

    private Long id;

    private String name;

    private Instant createdAt;

    private Instant modifiedAt;

    private Instant lastPostAt;

    private Boolean isDeleted;

    private Set<PostDTO> relatedPosts = new HashSet<>();

    private MUserDTO channelCreator;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getModifiedAt() {
        return modifiedAt;
    }

    public void setModifiedAt(Instant modifiedAt) {
        this.modifiedAt = modifiedAt;
    }

    public Instant getLastPostAt() {
        return lastPostAt;
    }

    public void setLastPostAt(Instant lastPostAt) {
        this.lastPostAt = lastPostAt;
    }

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }

    public Set<PostDTO> getRelatedPosts() {
        return relatedPosts;
    }

    public void setRelatedPosts(Set<PostDTO> relatedPosts) {
        this.relatedPosts = relatedPosts;
    }

    public MUserDTO getChannelCreator() {
        return channelCreator;
    }

    public void setChannelCreator(MUserDTO channelCreator) {
        this.channelCreator = channelCreator;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ChannelDTO)) {
            return false;
        }

        ChannelDTO channelDTO = (ChannelDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, channelDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ChannelDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            ", modifiedAt='" + getModifiedAt() + "'" +
            ", lastPostAt='" + getLastPostAt() + "'" +
            ", isDeleted='" + getIsDeleted() + "'" +
            ", relatedPosts=" + getRelatedPosts() +
            ", channelCreator=" + getChannelCreator() +
            "}";
    }
}
