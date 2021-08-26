package com.gsr.blogger.service;

import com.gsr.blogger.domain.UserStatistic;
import com.gsr.blogger.repository.UserStatisticRepository;
import com.gsr.blogger.service.dto.UserStatisticDTO;
import com.gsr.blogger.service.mapper.UserStatisticMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link UserStatistic}.
 */
@Service
@Transactional
public class UserStatisticService {

    private final Logger log = LoggerFactory.getLogger(UserStatisticService.class);

    private final UserStatisticRepository userStatisticRepository;

    private final UserStatisticMapper userStatisticMapper;

    public UserStatisticService(UserStatisticRepository userStatisticRepository, UserStatisticMapper userStatisticMapper) {
        this.userStatisticRepository = userStatisticRepository;
        this.userStatisticMapper = userStatisticMapper;
    }

    /**
     * Save a userStatistic.
     *
     * @param userStatisticDTO the entity to save.
     * @return the persisted entity.
     */
    public UserStatisticDTO save(UserStatisticDTO userStatisticDTO) {
        log.debug("Request to save UserStatistic : {}", userStatisticDTO);
        UserStatistic userStatistic = userStatisticMapper.toEntity(userStatisticDTO);
        userStatistic = userStatisticRepository.save(userStatistic);
        return userStatisticMapper.toDto(userStatistic);
    }

    /**
     * Partially update a userStatistic.
     *
     * @param userStatisticDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<UserStatisticDTO> partialUpdate(UserStatisticDTO userStatisticDTO) {
        log.debug("Request to partially update UserStatistic : {}", userStatisticDTO);

        return userStatisticRepository
            .findById(userStatisticDTO.getId())
            .map(
                existingUserStatistic -> {
                    userStatisticMapper.partialUpdate(existingUserStatistic, userStatisticDTO);

                    return existingUserStatistic;
                }
            )
            .map(userStatisticRepository::save)
            .map(userStatisticMapper::toDto);
    }

    /**
     * Get all the userStatistics.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<UserStatisticDTO> findAll() {
        log.debug("Request to get all UserStatistics");
        return userStatisticRepository.findAll().stream().map(userStatisticMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     *  Get all the userStatistics where LinkedUser is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<UserStatisticDTO> findAllWhereLinkedUserIsNull() {
        log.debug("Request to get all userStatistics where LinkedUser is null");
        return StreamSupport
            .stream(userStatisticRepository.findAll().spliterator(), false)
            .filter(userStatistic -> userStatistic.getLinkedUser() == null)
            .map(userStatisticMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one userStatistic by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<UserStatisticDTO> findOne(Long id) {
        log.debug("Request to get UserStatistic : {}", id);
        return userStatisticRepository.findById(id).map(userStatisticMapper::toDto);
    }

    /**
     * Delete the userStatistic by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete UserStatistic : {}", id);
        userStatisticRepository.deleteById(id);
    }
}
