package com.gsr.blogger.service;

import com.gsr.blogger.domain.MUser;
import com.gsr.blogger.repository.MUserRepository;
import com.gsr.blogger.service.dto.MUserDTO;
import com.gsr.blogger.service.mapper.MUserMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link MUser}.
 */
@Service
@Transactional
public class MUserService {

    private final Logger log = LoggerFactory.getLogger(MUserService.class);

    private final MUserRepository mUserRepository;

    private final MUserMapper mUserMapper;

    public MUserService(MUserRepository mUserRepository, MUserMapper mUserMapper) {
        this.mUserRepository = mUserRepository;
        this.mUserMapper = mUserMapper;
    }

    /**
     * Save a mUser.
     *
     * @param mUserDTO the entity to save.
     * @return the persisted entity.
     */
    public MUserDTO save(MUserDTO mUserDTO) {
        log.debug("Request to save MUser : {}", mUserDTO);
        MUser mUser = mUserMapper.toEntity(mUserDTO);
        mUser = mUserRepository.save(mUser);
        return mUserMapper.toDto(mUser);
    }

    /**
     * Partially update a mUser.
     *
     * @param mUserDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<MUserDTO> partialUpdate(MUserDTO mUserDTO) {
        log.debug("Request to partially update MUser : {}", mUserDTO);

        return mUserRepository
            .findById(mUserDTO.getId())
            .map(
                existingMUser -> {
                    mUserMapper.partialUpdate(existingMUser, mUserDTO);

                    return existingMUser;
                }
            )
            .map(mUserRepository::save)
            .map(mUserMapper::toDto);
    }

    /**
     * Get all the mUsers.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<MUserDTO> findAll() {
        log.debug("Request to get all MUsers");
        return mUserRepository.findAll().stream().map(mUserMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one mUser by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<MUserDTO> findOne(Long id) {
        log.debug("Request to get MUser : {}", id);
        return mUserRepository.findById(id).map(mUserMapper::toDto);
    }

    /**
     * Delete the mUser by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete MUser : {}", id);
        mUserRepository.deleteById(id);
    }
}
